import { z } from "zod";

//OTP verification schema
export const otpVerificationSchema = z.string().length(6,'otp must be 6 digits');