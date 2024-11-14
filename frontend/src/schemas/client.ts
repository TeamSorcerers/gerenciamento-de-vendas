import { z } from "zod";
import { isMobilePhone } from "validator";

export const registerClientSchema = z.object({
    name: z.string().min(2, "Um nome deve conter no mínimo 2 caracteres."),
    phone: z.string().refine(isMobilePhone, "Digite um número de telefone válido."),
});

export type RegisterClientData = z.infer<typeof registerClientSchema>;