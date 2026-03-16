import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { UserService } from "../../../src/http/modules/users/users.service";

const mockGetAllAvatars = UserService.getAllAvatars as jest.Mock;

describe("GET /api/v1/user/avatars (Protected)", () => {
  beforeAll(() => {
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  it("returns 401 when Authorization header is missing", async () => {
    const res = await request(app).get("/api/v1/user/avatars");

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(0);
    expect(mockGetAllAvatars).not.toHaveBeenCalled();
  });

  it("returns 404 when token is invalid", async () => {
    const badToken = jwt.sign({ id: "user-id-1" }, "wrong-secret");
    const res = await request(app)
      .get("/api/v1/user/avatars")
      .set("Authorization", `Bearer ${badToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(0);
    expect(mockGetAllAvatars).not.toHaveBeenCalled();
  });

  it("returns all avatars for valid token", async () => {
    const token = jwt.sign(
      { id: "user-id-1", username: "u1" },
      process.env.USER_JWT_SECRET!,
    );

    mockGetAllAvatars.mockResolvedValueOnce([
      { id: "a1", imageUrl: "https://img/1", name: "Cat" },
      { id: "a2", imageUrl: "https://img/2", name: "Dog" },
    ]);

    const res = await request(app)
      .get("/api/v1/user/avatars")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.message).toBe("Retrieved Succesfully");
    expect(res.body.data.avatars).toHaveLength(2);
    expect(mockGetAllAvatars).toHaveBeenCalledTimes(1);
  });
});

