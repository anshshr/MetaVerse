import request from "supertest";
import { UserService } from "../../../src/http/modules/users/users.service";
import app from "../../../src/app";
import { AuthService } from "../../../src/http/modules/auth/auth.service";
import { AdminService } from "../../../src/http/modules/admin/admin.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const mockUpdateMetdata = UserService.updateMetadata as jest.Mock;
const mockRegisterUser = AuthService.registerUser as jest.Mock;
const mockLoginUser = AuthService.loginUser as jest.Mock;
const mockCreateAvatar = AdminService.createAvatar as jest.Mock;

let url: string = "/api/v1/user/metadata";

describe("POST /api/v1/user/metadata (Protected)", () => {
  let user_token: string = "";
  let admin_token: string = "";
  let avatar_id: string = "";

  beforeAll(async () => {
    process.env.ADMIN_JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ?? "admin-secret";
    process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET ?? "user-secret";

    const adminJwt = jwt.sign(
      { id: "admin-id-1", username: "ansh_admin" },
      process.env.ADMIN_JWT_SECRET,
    );
    const userJwt = jwt.sign(
      { id: "user-id-1", username: "ansh_user" },
      process.env.USER_JWT_SECRET,
    );

    mockRegisterUser.mockResolvedValueOnce("admin-id-1");
    mockLoginUser.mockResolvedValueOnce(adminJwt);
    mockCreateAvatar.mockResolvedValueOnce("avatar-id-1");
    mockRegisterUser.mockResolvedValueOnce("user-id-1");
    mockLoginUser.mockResolvedValueOnce(userJwt);

    // make an admin login
    await request(app).post("/api/v1/auth/register").send({
      username: "ansh_admin",
      password: "1234",
      type: "Admin",
    });

    const adminLogin = await request(app).post("/api/v1/auth/login").send({
      username: "ansh_admin",
      password: "1234",
    });

    expect(adminLogin.statusCode).toBe(200);
    expect(adminLogin.body?.data?.token).toBeDefined();

    admin_token = adminLogin.body.data.token;

    // make an request create an avatar and get the avatar id passing the admin token in the bearer request
    const adminAvatar = await request(app)
      .post("/api/v1/admin/avatar")
      .send({
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAmva0qqzj2OVKGSAdPrOtVuz5yFn_PnEHdA&s",
        name: "Cat",
      })
      .set("Authorization", `Bearer ${admin_token}`);

    expect(adminAvatar.statusCode).toBe(200);
    expect(adminAvatar.body?.data?.avatarId).toBeDefined();

    avatar_id = adminAvatar.body.data.avatarId;

    // then make user login
    await request(app).post("/api/v1/auth/register").send({
      username: "ansh_user",
      password: "1234",
      type: "User",
    });

    const userLogin = await request(app).post("/api/v1/auth/login").send({
      username: "ansh_user",
      password: "1234",
    });

    // get the user token
    expect(userLogin.statusCode).toBe(200);
    expect(userLogin.body?.data?.token).toBeDefined();

    user_token = userLogin.body.data.token;
  });

  it("should return the successfully message with 200 status code on correct data", async () => {
    // arrange
    mockUpdateMetdata.mockResolvedValueOnce(null);

    //act(then make a request to create an avatar)

    const res = await request(app)
      .post(url)
      .send({
        avatarId: avatar_id,
      })
      .set("Authorization", `Bearer ${user_token}`);

    expect(res.statusCode).toBe(200);
    expect(mockUpdateMetdata).toHaveBeenCalledWith("avatar-id-1", "user-id-1");
  });
});
