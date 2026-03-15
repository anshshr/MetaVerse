import request from "supertest";
import app from "../../../src/app";
import { AuthService } from "../../../src/http/modules/auth/auth.service";

const mockRegisterUser = AuthService.registerUser as jest.Mock;

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new User successfully and return 200 with id", async () => {
    mockRegisterUser.mockResolvedValueOnce("user-id-123");

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "testuser",
      password: "password123",
      type: "User",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: "Successfully Registered",
      status: 1,
      data: { id: "user-id-123" },
    });
    expect(mockRegisterUser).toHaveBeenCalledWith(
      "testuser",
      "password123",
      "User",
    );
  });

  it("should register a new Admin successfully and return 200 with id", async () => {
    mockRegisterUser.mockResolvedValueOnce("admin-id-456");

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "testadmin",
      password: "adminpass",
      type: "Admin",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: "Successfully Registered",
      status: 1,
      data: { id: "admin-id-456" },
    });
    expect(mockRegisterUser).toHaveBeenCalledWith(
      "testadmin",
      "adminpass",
      "Admin",
    );
  });

  it("should return 400 when password is missing", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "testuser",
      type: "User",
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("should return 400 when username is missing", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      password: "password123",
      type: "User",
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("should return 400 when type is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "testuser",
      password: "password123",
      type: "SuperAdmin",
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("should return 400 when request body is empty", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("should return 400 when username is already taken", async () => {
    mockRegisterUser.mockRejectedValueOnce("This value already exists.");

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "existinguser",
      password: "password123",
      type: "User",
    });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      message: "This value already exists.",
      status: 0,
    });
  }
);
});