import { z } from "zod";

export const registerSaleSchema = z.object({
  clientCode: z.number().min(1, "O código do cliente deve ser um número"),
  paymentMethod: z.number(),
  cart: z.array(z.object({
    productCode: z.number(),
    amount: z.number(),
  })),
});
