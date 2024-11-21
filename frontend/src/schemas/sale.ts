import { z } from "zod";

export const registerSaleSchema = z.object({
    clientCode: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }),
    paymentMethod: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }).min(1, "Método inválido").max(4, "Método inválido")
});

export type RegisterSaleData = z.infer<typeof registerSaleSchema>;