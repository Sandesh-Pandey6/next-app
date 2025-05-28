import dbConnect from "@/app/db_conn/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from "@/app/help/sendVerificationEmail"

export async function POST ( request: Request){
    await dbConnect()
    try {
       const{username,email,password}= await request.json()
       const existingUserVerificationByUsename= await UserModel.findOne({
        username,
        isVarified: true
       })
       if(existingUserVerificationByUsename){
        return Response.json({
            success:false,
            message:"User already exists"

        },{status:400})
       }
      const existingUserByEmail= await UserModel.findOne({email})
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

      if (existingUserByEmail){
        if (existingUserByEmail.isVarified) {
            return Response.json({
                success: false,
                message: "This email is already registerd"

            },{status:500})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.VerifyCode = verifyCode;
            existingUserByEmail.VerifyCodeExpery = new Date(Date.now()+ 3600000);
            
            await existingUserByEmail.save()
        }
      }

      if (existingUserByEmail) {
        true 
      }else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 5);
       const newUser = new UserModel({
             username,
             email,
            password: hashedPassword,
            verifyCode,
            VerifyCodeExpery: expiryDate,
                 isVarified: false,
                 isAcceptingMessage: true,
                 messages: []
        })
        await newUser.save()
        
      }
      //send verififcaation email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      )

      if (!emailResponse.success) {
        return Response.json({
            success: false,
            message: emailResponse.message
        },{status:500})
      }
      return Response.json({
            success: false,
            message:"User regester succesfully."
        },{status:500})



    } catch(error) {
        console.error('error regestrating user',error)
        return Response.json(
            {
            success:false,
            message: 'Error registering user',
            },
            {
                status: 500
            }

        )
    }
}