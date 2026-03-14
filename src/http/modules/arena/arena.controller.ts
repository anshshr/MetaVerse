import type { Request, Response } from "express";
import type { ResponseInterface } from "../../../core/response/reponse_interface.js";
import { customErrorMessgae } from "../../../core/error/custom_error.js";
import { ArenaService } from "./arena.service.js";
import type { Element } from "../../../generated/prisma/client.js";
import { addElement } from "./arena.types.js";

export const ArenaController = {
  //get a particualr space
  async getSpaceController(req: Request, res: Response) {
    try {
      const response = await ArenaService.getSpace(req.params.spaceId as string);

      const ans: ResponseInterface<{ space: Awaited<ReturnType<typeof ArenaService.getSpace>> }> = {
        message: "Space Retrieved",

        status: 1,

        data: {
          space: response,
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

  //add an element in the space
  async addElementController(req: Request, res: Response) {
    try {
      const element = addElement.safeParse(req.body);

      if (element.success) {
        const { elementId, spaceId, x, y } = element.data;
        const response = await ArenaService.addElement(elementId, spaceId, x, y);

        const ans: ResponseInterface<{ elementId: string }> = {
          message: "Element Created Succesfully",
          status: 1,
          data: {
            elementId: response,
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

  //delete an element

  async deleteElementController(req: Request, res: Response) {
    try {
      await ArenaService.deleteElement(req.body.elementId);
      const ans: ResponseInterface<null> = {
        message: "Element Deleted Succesfully",
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

  // see all the elements
  async getAllElementsController(req: Request, res: Response) {
    try {
      const elements = await ArenaService.getAllElements();
      const ans: ResponseInterface<{ elements: Element[] }> = {
        message: "Elements retrieved Succesfully",
        status: 1,
        data: {
          elements: elements,
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
