import { Router } from "express";
import { AdminRouter } from "./http/modules/admin/admin.routes.js";
import { AuthRouter } from "./http/modules/auth/auth.routes.js";
import { UserRouter } from "./http/modules/users/users.routes.js";
import { SpaceRouter } from "./http/modules/space/space.routes.js";
import { ArenaRouter } from "./http/modules/arena/arena.routes.js";
import { adminMiddleWare } from "./middleware/admin.middleware.js";
import { userMiddleWare } from "./middleware/user.middleware.js";

export const router = Router();

router.use("/auth", AuthRouter);

router.use("/admin", adminMiddleWare, AdminRouter);
router.use(userMiddleWare);
router.use("/user", UserRouter);
router.use("/space", SpaceRouter);
router.use("/arena", ArenaRouter);
