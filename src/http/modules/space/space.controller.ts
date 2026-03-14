import type { Request, Response } from "express";
import type { ResponseInterface } from "../../../core/response/reponse_interface.js";
import { customErrorMessgae } from "../../../core/error/custom_error.js";
import { createSpaceSchema } from "./space.types.js";
import { SpaceService } from "./space.service.js";
import type { Space } from "../../../generated/prisma/client.js";
export const SpaceController = {
  // create a space
  async createSpace(req: Request, res: Response) {
    try {
      const spaceSchema = createSpaceSchema.safeParse(req.body);

      if (spaceSchema.success) {
        const { name, dimensions, mapId } = spaceSchema.data;
        const userId = res.locals.userId as string;
        const response = await SpaceService.createSpace(
          name,
          dimensions,
          mapId,
          userId,
        );

        const ans: ResponseInterface<{ spaceId: string }> = {
          message: "Space Created",
          status: 1,
          data: {
            spaceId: response,
          },
        };

        res.status(200).json(ans);
      } else {
        throw spaceSchema.error;
      }
    } catch (error) {
      const result: ResponseInterface<null> = {
        message: customErrorMessgae(error),
        status: 0,
      };

      res.status(400).json(result);
    }
  },

  //delete a space
  async deleteSpace(req: Request, res: Response) {
    try {
      const spaceId = req.params.spaceId as string;
      await SpaceService.deleteSpace(spaceId);
      const ans: ResponseInterface<null> = {
        message: "Space Deleted",
        status: 1,
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

  // get all my spaces

  async getAllMySpaces(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const resposne = await SpaceService.getMySpaces(userId);

      const ans: ResponseInterface<{ spaces: Space[] }> = {
        message: "Spaces Retrieved",
        status: 1,
        data: {
          spaces: resposne,
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
