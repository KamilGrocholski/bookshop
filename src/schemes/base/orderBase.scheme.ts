import type { Order } from "@prisma/client";
import { z } from "zod";

export const ORDER_STATUSES: Order["status"][] = [
  "CANCEL",
  "PENDING",
  "SHIPPING",
  "DELIVERED",
];

export const orderBase = {
  id: z.string().uuid(),
  status: z.string().refine((value) => {
    if (ORDER_STATUSES.includes(value as Order["status"])) return true;
  }) as z.ZodType<Order["status"]>,
  total: z.number().nonnegative(),
};
