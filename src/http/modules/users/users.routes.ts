import { Router } from "express";
import { UserController } from "./users.controllers.js";

export const UserRouter = Router();

UserRouter.post("/metadata", UserController.updateMetadata);
UserRouter.get("/avatars", UserController.getAllAvatars);
UserRouter.get("/metadata/bulk/:ids", UserController.getAvatarIds);
