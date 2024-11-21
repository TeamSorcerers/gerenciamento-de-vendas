import { z } from "zod";

export const stockSchema = z.array(z.object({
  code: z.number(),
  name: z.string(),
  price: z.number().min(1),
  amountAvailable: z.number().min(1),
}));
