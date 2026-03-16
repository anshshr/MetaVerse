import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { SpaceService } from "../../../src/http/modules/space/space.service";

const mockCreateSpace = SpaceService.createSpace as jest.Mock;
const mockDeleteSpace = SpaceService.deleteSpace as jest.Mock;
const mockGetMySpaces = SpaceService.getMySpaces as jest.Mock;

describe("Space endpoints (Protected)", () => {
  beforeAll(() => {
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  function userToken() {
    return jwt.sign({ id: "user-id-1", username: "u1" }, process.env.USER_JWT_SECRET!);
  }

  it("POST /api/v1/space creates space", async () => {
    mockCreateSpace.mockResolvedValueOnce("space-id-1");

    const res = await request(app)
      .post("/api/v1/space")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ name: "My Space", dimensions: "10x10", mapId: "map-id-1" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Space Created",
      status: 1,
      data: { spaceId: "space-id-1" },
    });
    expect(mockCreateSpace).toHaveBeenCalledWith(
      "My Space",
      "10x10",
      "map-id-1",
      "user-id-1",
    );
  });

  it("POST /api/v1/space returns 400 when body is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/space")
      .set("Authorization", `Bearer ${userToken()}`)
      .send({ name: "My Space", dimensions: "10x10" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockCreateSpace).not.toHaveBeenCalled();
  });

  it("GET /api/v1/space/all returns spaces", async () => {
    mockGetMySpaces.mockResolvedValueOnce([{ id: "s1" }, { id: "s2" }]);

    const res = await request(app)
      .get("/api/v1/space/all")
      .set("Authorization", `Bearer ${userToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data.spaces).toHaveLength(2);
    expect(mockGetMySpaces).toHaveBeenCalledWith("user-id-1");
  });

  it("DELETE /api/v1/space/:spaceId deletes space", async () => {
    mockDeleteSpace.mockResolvedValueOnce(null);

    const res = await request(app)
      .delete("/api/v1/space/space-id-1")
      .set("Authorization", `Bearer ${userToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ message: "Space Deleted", status: 1 });
    expect(mockDeleteSpace).toHaveBeenCalledWith("space-id-1");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/v1/space/all");
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(0);
  });
});

