import { z } from "zod";

export const registerSaleSchema = z.object({
  clientCode: z.number().min(1, "O código do cliente deve ser um número"),
  paymentMethod: z.number(),
  price: z.number().positive("O preço deve ser positivo"),
});
