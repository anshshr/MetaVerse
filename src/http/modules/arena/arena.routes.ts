import { Router } from "express";
import { ArenaController } from "./arena.controller.js";

export const ArenaRouter = Router();

ArenaRouter.get("/elements", ArenaController.getAllElementsController);
ArenaRouter.get("/:spaceId", ArenaController.getSpaceController);
ArenaRouter.post("/element", ArenaController.addElementController);
ArenaRouter.delete("/element", ArenaController.deleteElementController);
