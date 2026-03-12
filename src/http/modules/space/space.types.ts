import * as z from "zod";

// space types
export const createSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string(),
  mapId: z.string(),
});


