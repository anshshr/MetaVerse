import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { ArenaService } from "../../../src/http/modules/arena/arena.service";

const mockGetSpace = ArenaService.getSpace as jest.Mock;
const mockAddElement = ArenaService.addElement as jest.Mock;
const mockDeleteElement = ArenaService.deleteElement as jest.Mock;
const mockGetAllElements = ArenaService.getAllElements as jest.Mock;

describe("Arena endpoints (Protected)", () => {
  beforeAll(() => {
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  function userToken() {
    return jwt.sign({ id: "user-id-1" }, process.env.USER_JWT_SECRET!);
  }

  it("GET /api/v1/arena/elements returns elements", async () => {
    mockGetAllElements.mockResolvedValueOnce([{ id: "e1" }, { id: "e2" }]);

    const res = await request(app)
      .get("/api/v1/arena/elements")
      .set("Authorization", `Bearer ${userToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data.elements).toHaveLength(2);
    expect(mockGetAllElements).toHaveBeenCalledTimes(1);
  });

  it("GET /api/v1/arena/:spaceId returns space", async () => {
    mockGetSpace.mockResolvedValueOnce({ id: "space-id-1" });

    const res = await request(app)
      .get("/api/v1/arena/space-id-1")
      .set("Authorization", `Bearer ${userToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data.space).toMatchObject({ id: "space-id-1" });
    expect(mockGetSpace).toHaveBeenCalledWith("space-id-1");
  });

  it("POST /api/v1/arena/element adds element", async () => {
    mockAddElement.mockResolvedValueOnce("space-element-id-1");

    const res = await request(app)
      .post("/api/v1/arena/element")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ elementId: "e1", spaceId: "s1", x: 1, y: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Element Created Succesfully",
      status: 1,
      data: { elementId: "space-element-id-1" },
    });
    expect(mockAddElement).toHaveBeenCalledWith("e1", "s1", 1, 2);
  });

  it("POST /api/v1/arena/element returns 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/arena/element")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ spaceId: "s1", x: 1, y: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockAddElement).not.toHaveBeenCalled();
  });

  it("DELETE /api/v1/arena/element deletes element", async () => {
    mockDeleteElement.mockResolvedValueOnce(null);

    const res = await request(app)
      .delete("/api/v1/arena/element")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ elementId: "space-element-id-1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Element Deleted Succesfully",
      status: 1,
    });
    expect(mockDeleteElement).toHaveBeenCalledWith("space-element-id-1");
  });
});

