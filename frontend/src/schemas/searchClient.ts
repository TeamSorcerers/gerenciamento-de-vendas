import { z } from "zod";

export const searchClientSchema = z.object({
    clientCode: z.coerce.number({
        required_error: "Este campo é obrigatório."
    }),
});

export type SearchClientData = z.infer<typeof searchClientSchema>;