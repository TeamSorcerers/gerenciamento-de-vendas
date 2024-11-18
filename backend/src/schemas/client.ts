import { z } from "zod";
import validator from "validator";

export const registerClientSchema = z.object({
  name: z.string({ required_error: "Este campo é obrigatório." }).min(2, "Um nome deve conter no mínimo 2 caracteres."),
  phone: z.string({ required_error: "Este campo é obrigatório." }).refine(validator.isMobilePhone, "Digite um número de telefone válido."),
});
