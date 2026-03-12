import { Router } from "express";
import { SpaceController } from "./space.controller.js";

export const SpaceRouter = Router();

SpaceRouter.post("/", SpaceController.createSpace);
SpaceRouter.delete("/:spaceId", SpaceController.deleteSpace);
SpaceRouter.get("/all", SpaceController.getAllMySpaces);
