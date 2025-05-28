import { resend } from "../db_conn/resend";
import VerificationEmail from "../../../email/verificationEmails";
import { ApiResponse } from "../types/apiResponse";


export async function  sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,

): Promise <ApiResponse>{
    try {
        await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to:email,
    subject: "Verification code for annomius message",
    react: VerificationEmail({username,otp:verifyCode}),
         
         });
          return { success: true, message:'Verification email send succefully'}

    }catch (emailError){
        console.error("Error sending Verification",(emailError))

        return { success: false, message:'Faied to send verification email'}
    }

}


