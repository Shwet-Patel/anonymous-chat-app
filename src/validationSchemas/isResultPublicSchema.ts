import { z } from "zod";

export const isResultPublicSchema = z.object({
    isResultPublic: z.boolean(),
});