import response from "supertest";
import app from "../../../src/app";
import { AuthService } from "../../../src/http/modules/auth/auth.service";

const mockLoginUser = AuthService.loginUser as jest.Mock;
let url: string = "/api/v1/auth/login";

describe("POST /api/v1/auth/login", () => {
  it("should return token when succesfully logged in", async () => {
    //arrange(we are defining that what would be returned once when this is succesfully executed)
    mockLoginUser.mockResolvedValueOnce("adhasdhasldhalhsadfh");

    //act(performing the actual test)
    const res = await response(app).post(url).send({
      username: "ansh",
      password: "1234",
    });

    // assert(cheacking that what we have defined is actualy returning or not)

    //  matching the status code
    expect(res.statusCode).toBe(200);

    // checking the response format
    expect(res.body).toMatchObject({
      message: "succesfully logged in",
      status: 1,
      data: {
        token: "adhasdhasldhalhsadfh",
      },
    });

    //checking the token value
    expect(res.body.data.token).toBe("adhasdhasldhalhsadfh");

    // check that the ao called with the correct data
    expect(mockLoginUser).toHaveBeenCalledWith("ansh", "1234");

    //chekcking that the api is only called once
    expect(mockLoginUser).toHaveBeenCalledTimes(1);
  });

  it("should return the status 400 when the password is not provided", async () => {
    mockLoginUser.mockRejectedValueOnce(null);

    //act(performing the actual test)
    const res = await response(app).post(url).send({
      username: "ansh",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it("should return the status 400 when the username is not provided", async () => {
    mockLoginUser.mockRejectedValueOnce(null);

    //act(performing the actual test)
    const res = await response(app).post(url).send({
      password: "1234",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it("should return the status 400 when the empty data is  provided", async () => {
    mockLoginUser.mockRejectedValueOnce(null);

    //act(performing the actual test)
    const res = await response(app).post(url).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    expect(mockLoginUser).not.toHaveBeenCalled();
  });
});
