import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { AdminService } from "../../../src/http/modules/admin/admin.service";

const mockCreateElement = AdminService.createElement as jest.Mock;
const mockUpdateElement = AdminService.updateElement as jest.Mock;

describe("Admin element endpoints (Protected)", () => {
  beforeAll(() => {
    process.env.ADMIN_JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ?? "admin-secret";
  });

  function adminToken(secret = process.env.ADMIN_JWT_SECRET!) {
    return jwt.sign({ id: "admin-id-1", username: "a1" }, secret);
  }

  it("POST /api/v1/admin/element returns 401 without token", async () => {
    const res = await request(app).post("/api/v1/admin/element").send({
      imageUrl: "https://img/1",
      width: 1,
      height: 2,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(0);
    expect(mockCreateElement).not.toHaveBeenCalled();
  });

  it("POST /api/v1/admin/element returns 403 with invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/admin/element")
      .set("Authorization", `Bearer ${adminToken("wrong-secret")}`)
      .send({ imageUrl: "https://img/1", width: 1, height: 2 });

    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(0);
    expect(mockCreateElement).not.toHaveBeenCalled();
  });

  it("POST /api/v1/admin/element creates element for valid token", async () => {
    mockCreateElement.mockResolvedValueOnce("element-id-1");

    const res = await request(app)
      .post("/api/v1/admin/element")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ imageUrl: "https://img/1", width: 10, height: 20 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Element created successfully",
      status: 1,
      data: { id: "element-id-1" },
    });
    expect(mockCreateElement).toHaveBeenCalledWith("https://img/1", 10, 20);
  });

  it("POST /api/v1/admin/element returns 400 on invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/admin/element")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ imageUrl: "https://img/1", width: -1, height: 20 });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockCreateElement).not.toHaveBeenCalled();
  });

  it("PUT /api/v1/admin/element/:elementId updates element", async () => {
    mockUpdateElement.mockResolvedValueOnce("element-id-1");

    const res = await request(app)
      .put("/api/v1/admin/element/element-id-1")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ imageUrl: "https://img/new" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Element updated successfully",
      status: 1,
      data: { id: "element-id-1" },
    });
    expect(mockUpdateElement).toHaveBeenCalledWith(
      "element-id-1",
      "https://img/new",
    );
  });

  it("PUT /api/v1/admin/element/:elementId returns 400 on invalid body", async () => {
    const res = await request(app)
      .put("/api/v1/admin/element/element-id-1")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockUpdateElement).not.toHaveBeenCalled();
  });
});

