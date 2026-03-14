import type { Request, Response } from "express";
import { metadata } from "./users.type.js";
import { UserService } from "./users.service.js";
import type { ResponseInterface } from "../../../core/response/reponse_interface.js";
import { customErrorMessgae } from "../../../core/error/custom_error.js";
import type { Avatar } from "../../../generated/prisma/client.js";

export const UserController = {
  //update metadata
  async updateMetadata(req: Request, res: Response) {
    try {
      const data = metadata.safeParse(req.body);

      if (data.success) {
        const { avatarId } = data.data;

        await UserService.updateMetadata(avatarId, res.locals.userId as string);
        const result: ResponseInterface<null> = {
          message: "Updated Succesfully",
          status: 1,
        };
        res.status(200).json(result);
      } else {
        throw data.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  // get all the available avatars
  async getAllAvatars(req: Request, res: Response) {
    try {
      const response = await UserService.getAllAvatars();
      const ans: ResponseInterface<{ avatars: Avatar[] }> = {
        message: "Retrieved Succesfully",
        status: 1,
        data: {
          avatars: response,
        },
      };

      res.status(200).json(ans);
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  // get other avatars
  async getAvatarIds(req: Request, res: Response) {
    try {
      const ids = (req.params.ids as string)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      const response = await UserService.getAvatarIds(ids);
      const ans: ResponseInterface<{ avatars: Avatar[] }> = {
        message: "Retrieved Succesfully",
        status: 1,
        data: {
          avatars: response,
        },
      };

      res.status(200).json(ans);
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },
};
