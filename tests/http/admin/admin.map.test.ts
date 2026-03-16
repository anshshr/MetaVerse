import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../src/app";
import { AdminService } from "../../../src/http/modules/admin/admin.service";

const mockCreateMap = AdminService.createMap as jest.Mock;

describe("POST /api/v1/admin/map (Protected)", () => {
  beforeAll(() => {
    process.env.ADMIN_JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ?? "admin-secret";
  });

  it("creates map for valid admin token", async () => {
    const token = jwt.sign({ id: "admin-id-1" }, process.env.ADMIN_JWT_SECRET!);
    mockCreateMap.mockResolvedValueOnce("map-id-1");

    const defaultElements = [{ elementId: "e1", x: 0, y: 0 }];
    const res = await request(app)
      .post("/api/v1/admin/map")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Map",
        dimensions: "10x20",
        defaultElements,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Map created successfully",
      status: 1,
      data: { id: "map-id-1" },
    });
    expect(mockCreateMap).toHaveBeenCalledWith("Test Map", "10x20", defaultElements);
  });

  it("returns 400 when body is invalid", async () => {
    const token = jwt.sign({ id: "admin-id-1" }, process.env.ADMIN_JWT_SECRET!);
    const res = await request(app)
      .post("/api/v1/admin/map")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Map", defaultElements: [] });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockCreateMap).not.toHaveBeenCalled();
  });
});

