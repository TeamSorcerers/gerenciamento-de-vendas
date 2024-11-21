import { z } from "zod";

export const searchClientSchema = z.object({ clientCode: z.number().min(1, "O código do cliente deve ser um número") });
