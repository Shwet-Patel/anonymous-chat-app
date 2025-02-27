import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"username must be atleast 2 chars")
    .max(20, "username must be atmax 20 chars")
    .regex(/^[a-zA-Z0-9_]+$/, "username should have no special chars");

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email('invalid email'),
    Password: z.string().min(6, 'pass should have atleast 6 chars'),
});