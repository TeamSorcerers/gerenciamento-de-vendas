import { z } from "zod";

export const registerProductSchema = z.object({
    name: z.string({
        required_error: "Este campo é obrigatório."
    }).min(2, "Um nome deve conter no mínimo 2 caracteres."),
    price: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }).min(1, "O preço unitário deve ser maior que zero."),
    amountAvailable: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }).min(0, "A quantidade disponível deve ser maior ou igual a zero.")
});

export type RegisterProductData = z.infer<typeof registerProductSchema>;