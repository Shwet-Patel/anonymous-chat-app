import { z } from "zod";

export const messageSchema = z.string().max(500, 'message cant be more than 500 chars');