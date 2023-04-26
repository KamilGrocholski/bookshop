import { z } from "zod";

export const cartItemBase = {
  quantity: z.number().int().nonnegative(),
};
