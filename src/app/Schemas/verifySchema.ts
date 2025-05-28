import {z} from "zod"

export const verifySchema = z.object ({
    id: z.string().length(6, "Verification Code must be 6 digit")
    
})