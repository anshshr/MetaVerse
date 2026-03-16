import jwt from "jsonwebtoken";
import { adminMiddleWare } from "../../src/middleware/admin.middleware";
import { userMiddleWare } from "../../src/middleware/user.middleware";

function makeRes() {
  const res: any = {
    locals: {},
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

describe("JWT middlewares", () => {
  beforeAll(() => {
    process.env.ADMIN_JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ?? "admin-secret";
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";
  });

  it("userMiddleWare returns 401 when missing token", () => {
    const req: any = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    userMiddleWare(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized", status: 0 });
    expect(next).not.toHaveBeenCalled();
  });

  it("userMiddleWare sets res.locals.userId and calls next for valid token", () => {
    const token = jwt.sign({ id: "user-id-1" }, process.env.USER_JWT_SECRET!);
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = jest.fn();

    userMiddleWare(req, res, next);

    expect(res.locals.userId).toBe("user-id-1");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("userMiddleWare returns 404 for invalid token", () => {
    const token = jwt.sign({ id: "user-id-1" }, "wrong-secret");
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = jest.fn();

    userMiddleWare(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token verification failed",
      status: 0,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("adminMiddleWare returns 403 for invalid token", () => {
    const token = jwt.sign({ id: "admin-id-1" }, "wrong-secret");
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = jest.fn();

    adminMiddleWare(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden", status: 0 });
    expect(next).not.toHaveBeenCalled();
  });
});

