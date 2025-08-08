import {z} from "zod";

export const signupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(6),
});

export const signinSchema = z.object({
    email: z.email(),
    password: z.string(),
});