import * as z from "zod";
import { Role } from "../../../generated/prisma/enums.js";

export const register = z.object({
  username: z.string(),
  password: z.string(),
  type: z.enum(Role),
});

export const login = z.object({
  username: z.string(),
  password: z.string(),
});





// admin types
export const createElement = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const createAvatar = z.object({
  imageUrl: z.string(),
  name: z.string(),
});
