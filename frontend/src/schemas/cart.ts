import { z } from "zod";

export const cartSchema = z.object({
    productCode: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }),
    amount: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }).min(1, "A quantidade mínima para venda é 1.")
});

export type CartData = z.infer<typeof cartSchema>;