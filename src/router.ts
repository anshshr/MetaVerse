import { Router } from "express";
import { AuthRouter } from "./http/modules/auth/auth.routes.js";
import { UserRouter } from "./http/modules/users/users.routes.js";
import { SpaceRouter } from "./http/modules/space/space.routes.js";
import { ArenaRouter } from "./http/modules/arena/arena.routes.js";

export const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/space", SpaceRouter);
router.use("/arena", ArenaRouter);
