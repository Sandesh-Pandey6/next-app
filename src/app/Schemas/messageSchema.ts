import {z} from "zod"

export const messageSchema = z.object({
    containt: z.string()
    .min(10,{message:"Containt must be atleas 10 charcater"})
    .max(50,{message:"Containt must be at most 50 character"})
})