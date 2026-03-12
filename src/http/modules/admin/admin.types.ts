import * as z from "zod";

export const createElementSchema = z.object({
  imageUrl: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  static: z.boolean().optional(),
});

export const updateElementSchema = z.object({
  imageUrl: z.string(),
});

export const createAvatarSchema = z.object({
  imageUrl: z.string(),
  name: z.string(),
});

export const createMapSchema = z.object({
  thumbnail: z.string().optional(),
  dimensions: z.string(),
  name: z.string(),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number().int(),
      y: z.number().int(),
    }),
  ),
});
