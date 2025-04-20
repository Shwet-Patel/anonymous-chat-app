import { z } from "zod";

export const createPollSchema = z.object({
  pollName: z
    .string()
    .min(5, { message: "Poll name must be at least 5 characters long." })
    .max(25, { message: "Poll name must not exceed 25 characters." }),

  startDate: z.preprocess((arg) => {
    return typeof arg === "string" ? new Date(arg) : arg;
  },
    z.date({ required_error: "Start date is required" })),
  
  endDate: z.preprocess((arg) => {
      return typeof arg === "string" ? new Date(arg) : arg;
  },
    z.date({ required_error: "End date is required" })),
  
  statement: z
    .string()
    .min(1, { message: "Poll statement is required." }),

  description: z
    .string()
    .min(1, { message: "Poll description is required." }),

  candidates: z
    .array(z.string().min(5, { message: "Each candidate name must be at least 5 characters." }))
    .min(2, { message: "At least two candidates are required." }),

  isResultPublic: z.boolean({
    required_error: "Please specify if the result should be public or not.",
  }),
}).refine((data) => data.endDate > data.startDate, {
  path: ["endDate"],
  message: "End date must be after the start date.",
});
