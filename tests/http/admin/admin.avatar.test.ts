import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { AdminService } from "../../../src/http/modules/admin/admin.service";

const mockCreateAvatar = AdminService.createAvatar as jest.Mock;

describe("POST /api/v1/admin/avatar (Protected)", () => {
  beforeAll(() => {
    process.env.ADMIN_JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ?? "admin-secret";
  });

  it("creates avatar for valid admin token", async () => {
    const token = jwt.sign({ id: "admin-id-1" }, process.env.ADMIN_JWT_SECRET!);
    mockCreateAvatar.mockResolvedValueOnce("avatar-id-1");

    const res = await request(app)
      .post("/api/v1/admin/avatar")
      .set("Authorization", `Bearer ${token}`)
      .send({ imageUrl: "https://img/a", name: "Cat" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Avatar created successfully",
      status: 1,
      data: { avatarId: "avatar-id-1" },
    });
    expect(mockCreateAvatar).toHaveBeenCalledWith("https://img/a", "Cat");
  });

  it("returns 400 when body is invalid", async () => {
    const token = jwt.sign({ id: "admin-id-1" }, process.env.ADMIN_JWT_SECRET!);
    const res = await request(app)
      .post("/api/v1/admin/avatar")
      .set("Authorization", `Bearer ${token}`)
      .send({ imageUrl: "https://img/a" });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockCreateAvatar).not.toHaveBeenCalled();
  });
});

