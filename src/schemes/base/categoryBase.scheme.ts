import { z } from "zod";

export const categoryBase = {
  id: z.bigint(),
  name: z.string(),
};
