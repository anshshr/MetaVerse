import * as z from "zod";

// space types
export const createSpaceSchema = z.object({
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
