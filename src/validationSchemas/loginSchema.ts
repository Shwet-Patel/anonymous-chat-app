import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.string().min(2,'should have minimum 2 chars'),
    password: z.string().min(6,'pass should have atleast 6 chars'),
});
