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



// space types
export const createSpace = z.object({
  name: z.string(),
  dimensions: z.string(),
  mapId: z.string(),
});

export const addElement = z.object({
  elementId: z.string(),
  spaceId: z.string(),
  x: z.number(),
  y: z.number(),
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
