import type { Request, Response } from "express";
import { customErrorMessgae } from "../../../core/error/custom_error.js";
import type { ResponseInterface } from "../../../core/response/reponse_interface.js";
import { AdminService } from "./admin.service.js";
import {
  createAvatarSchema,
  createElementSchema,
  createMapSchema,
  updateElementSchema,
} from "./admin.types.js";

export const AdminController = {
  async createElement(req: Request, res: Response) {
    try {
      const element = createElementSchema.safeParse(req.body);

      if (element.success) {
        const { imageUrl, width, height } = element.data;
        const response = await AdminService.createElement(
          imageUrl,
          width,
          height,
        );

        const ans: ResponseInterface<{ id: string }> = {
          message: "Element created successfully",
          status: 1,
          data: {
            id: response,
          },
        };

        res.status(200).json(ans);
      } else {
        throw element.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  async updateElement(req: Request, res: Response) {
    try {
      const element = updateElementSchema.safeParse(req.body);

      if (element.success) {
        const response = await AdminService.updateElement(
          req.params.elementId as string,
          element.data.imageUrl,
        );

        const ans: ResponseInterface<{ id: string }> = {
          message: "Element updated successfully",
          status: 1,
          data: {
            id: response,
          },
        };

        res.status(200).json(ans);
      } else {
        throw element.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  async createAvatar(req: Request, res: Response) {
    try {
      const avatar = createAvatarSchema.safeParse(req.body);

      if (avatar.success) {
        const { imageUrl, name } = avatar.data;
        const response = await AdminService.createAvatar(imageUrl, name);

        const ans: ResponseInterface<{ avatarId: string }> = {
          message: "Avatar created successfully",
          status: 1,
          data: {
            avatarId: response,
          },
        };

        res.status(200).json(ans);
      } else {
        throw avatar.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  async createMap(req: Request, res: Response) {
    try {
      const map = createMapSchema.safeParse(req.body);

      if (map.success) {
        const { name, dimensions, defaultElements } = map.data;
        const response = await AdminService.createMap(
          name,
          dimensions,
          defaultElements,
        );

        const ans: ResponseInterface<{ id: string }> = {
          message: "Map created successfully",
          status: 1,
          data: {
            id: response,
          },
        };

        res.status(200).json(ans);
      } else {
        throw map.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },
};
