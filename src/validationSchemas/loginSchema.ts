import { z } from "zod";

export const loginSchema = z.object({
    username: z.string(),
    Password: z.string(),
});
