import { z } from "zod";

export const addVoteSchema = z.object({
  option: z.string().min(5, { message: "Each candidate name must be at least 5 characters." })
});
