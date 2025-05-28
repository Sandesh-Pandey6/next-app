import { z } from "zod";

export const usernameValidation= z
.string()
.min(2,"Username must be atleat 2 character")
.max(20,"Username must be at most 20 characters")
.regex(/[a-zA-Z0-9_]{3,20}$/,"Username must cointains special symbole")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalid email'}),
    password: z.string().min(8,"Password must be at least 8 characters"),

})