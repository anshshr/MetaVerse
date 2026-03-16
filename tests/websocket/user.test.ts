import jwt from "jsonwebtoken";
import { prismaMock } from "../mocks/prisma.mock";
import { RoomManager } from "../../src/websocket/handler/RoomManager";
import { User } from "../../src/websocket/handler/user";

class MockWebSocket {
  private handlers: Record<string, (data: any) => any> = {};
  send = jest.fn((data: any, cb?: (err?: Error) => void) => cb?.());
  close = jest.fn();

  on(event: string, cb: (data: any) => any) {
    this.handlers[event] = cb;
    return this;
  }

  emit(event: string, data: any) {
    return this.handlers[event]?.(data);
  }
}

async function flush() {
  await new Promise<void>((resolve) => setImmediate(resolve));
}

describe("WebSocket User handler", () => {
  beforeAll(() => {
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0.51);
    (prismaMock.space.findUnique as jest.Mock).mockResolvedValue({
      id: "space-1",
      width: 10,
      height: 10,
    });
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id-1",
      avatar: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("handles join -> move accepted -> move rejected -> leave-space", async () => {
    const manager = {
      addUser: jest.fn(),
      getUsers: jest.fn().mockReturnValue([]),
      updatePosition: jest.fn(),
      broadcast: jest.fn(),
      sendMessage: jest.fn(),
      removeUser: jest.fn(),
      removeByWs: jest.fn(),
      getNearbyUsers: jest.fn().mockReturnValue([]),
      getUser: jest.fn(),
    };
    jest.spyOn(RoomManager, "getInstance").mockReturnValue(manager as any);

    const ws = new MockWebSocket();
    const user = new User(ws as any);

    const token = jwt.sign({ id: "user-id-1" }, process.env.USER_JWT_SECRET!);

    ws.emit(
      "message",
      Buffer.from(
        JSON.stringify({
          type: "join",
          payload: { token, spaceId: "space-1" },
        }),
      ),
    );
    await flush();

    expect(manager.addUser).toHaveBeenCalledWith("space-1", ws);
    expect(ws.send).toHaveBeenCalledTimes(1);
    const joinPayload = JSON.parse(ws.send.mock.calls[0]![0]);
    expect(joinPayload.type).toBe("space-joined");
    expect(joinPayload.payload.spawn).toEqual({ x: 5, y: 5 });
    expect(user.userId).toBe("user-id-1");
    expect(manager.broadcast).toHaveBeenCalledWith(
      "space-1",
      ws,
      expect.stringContaining('"type":"space-joined"'),
    );

    ws.emit(
      "message",
      Buffer.from(JSON.stringify({ type: "move", payload: { x: 1, y: 1 } })),
    );
    await flush();

    // Accepted movement broadcasts to others in the room
    const acceptedCall = manager.broadcast.mock.calls.find((c) =>
      String(c[2]).includes('"type":"movement"'),
    );
    expect(acceptedCall?.[0]).toBe("space-1");

    ws.emit(
      "message",
      Buffer.from(JSON.stringify({ type: "move", payload: { x: 100, y: 0 } })),
    );
    await flush();

    expect(manager.sendMessage).toHaveBeenCalledWith(
      ws,
      expect.stringContaining('"type":"movement-rejected"'),
    );

    ws.emit(
      "message",
      Buffer.from(
        JSON.stringify({
          type: "leave-space",
          payload: { spaceId: "space-1" },
        }),
      ),
    );
    await flush();

    expect(ws.close).toHaveBeenCalledTimes(1);
    expect(manager.removeUser).toHaveBeenCalledWith("space-1", ws);
    expect(manager.broadcast).toHaveBeenCalledWith(
      "space-1",
      ws,
      expect.stringContaining('"type":"user-left"'),
    );
  });
});
