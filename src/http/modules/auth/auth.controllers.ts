import { customErrorMessgae } from "../../../core/error/custom_error.js";
import type { ResponseInterface } from "../../../core/response/reponse_interface.js";
import { AuthService } from "./auth.service.js";
import { login, register } from "./auth.types.js";
import type { Request, Response } from "express";

export const AuthController = {
  // register a  user
  async registerUser(req: Request, res: Response) {
    try {
      const user = register.safeParse(req.body);

      if (user.success) {
        const { username, password, type } = user.data;
        const response = await AuthService.registerUser(
          username,
          password,
          type,
        );

        const ans: ResponseInterface<{ id: string }> = {
          message: "Successfully Registered",
          status: 1,
          data: {
            id: response,
          },
        };
      } else {
        throw user.error;
      }
    } catch (error) {
      const response: ResponseInterface<string> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(response);
    }
  },

  // login a user

  async loginUser(req: Request, res: Response) {
    try {
      const user = login.safeParse(req.body);

      if (user.success) {
        const { username, password } = user.data;

        const response = await AuthService.loginUser(username, password);
        const ans: ResponseInterface<{ token: string }> = {
          message: "succesfully logged in",

          status: 1,
          data: {
            token: response,
          },
        };
      } else {
        throw user.error;
      }
    } catch (error) {
      const response: ResponseInterface<string> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(response);
    }
  },
};
