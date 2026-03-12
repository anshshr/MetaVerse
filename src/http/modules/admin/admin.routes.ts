import { Router } from "express";
import { AdminController } from "./admin.controller.js";

export const AdminRouter = Router();

AdminRouter.post("/element", AdminController.createElement);
AdminRouter.put("/element/:elementId", AdminController.updateElement);
AdminRouter.post("/avatar", AdminController.createAvatar);
AdminRouter.post("/map", AdminController.createMap);
