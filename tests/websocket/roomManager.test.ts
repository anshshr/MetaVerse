import { RoomManager } from "../../src/websocket/handler/RoomManager";

class FakeWebSocket {
  send = jest.fn((data: any, cb?: (err?: Error) => void) => cb?.());
}

describe("RoomManager", () => {
  beforeEach(() => {
    // Reset singleton between tests to avoid state leakage.
    (RoomManager as any).instance = undefined;
  });

  it("broadcast sends to all sockets except sender", () => {
    const manager = RoomManager.getInstance();
    const ws1 = new FakeWebSocket() as any;
    const ws2 = new FakeWebSocket() as any;

    manager.addUser("space-1", ws1);
    manager.addUser("space-1", ws2);

    manager.broadcast("space-1", ws1, "hello");

    expect(ws1.send).not.toHaveBeenCalled();
    expect(ws2.send).toHaveBeenCalledWith("hello", expect.any(Function));
  });

  it("removeUser stops future broadcasts to that socket", () => {
    const manager = RoomManager.getInstance();
    const ws1 = new FakeWebSocket() as any;
    const ws2 = new FakeWebSocket() as any;

    manager.addUser("space-1", ws1);
    manager.addUser("space-1",ws2);
    manager.removeUser("space-1", ws2);

    manager.broadcast("space-1", ws1, "hello");

    expect(ws2.send).not.toHaveBeenCalled();
  });

  it("sendMessage calls ws.send", () => {
    const manager = RoomManager.getInstance();
    const ws = new FakeWebSocket() as any;

    manager.sendMessage(ws, "msg");

    expect(ws.send).toHaveBeenCalledWith("msg", expect.any(Function));
  });
});
