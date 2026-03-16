import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { UserService } from "../../../src/http/modules/users/users.service";

const mockGetAvatarIds = UserService.getAvatarIds as jest.Mock;

describe("GET /api/v1/user/metadata/bulk/:ids (Protected)", () => {
  beforeAll(() => {
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  it("passes parsed ids to UserService.getAvatarIds", async () => {
    const token = jwt.sign({ id: "user-id-1" }, process.env.USER_JWT_SECRET!);
    mockGetAvatarIds.mockResolvedValueOnce([
      { id: "a1", imageUrl: "https://img/1", name: "Cat" },
      { id: "a2", imageUrl: "https://img/2", name: "Dog" },
    ]);

    const res = await request(app)
      .get("/api/v1/user/metadata/bulk/a1, a2 ,,,")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data.avatars).toHaveLength(2);
    expect(mockGetAvatarIds).toHaveBeenCalledWith(["a1", "a2"]);
  });
});

