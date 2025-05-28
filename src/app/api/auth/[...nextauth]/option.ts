import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/app/db_conn/dbConnect";
import UserModel from "@/app/model/User";

export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
        providers: [
            CredentialsProvider({ 
             id: "credentials",
             name:"Credentials",
             credentials: {
            username: { label: "Username", type: "text", placeholder: "Enter your name" },
            password: { label: "Password", type: "password" }
             },
              async authorize(credentials:any):Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({ $or:[
                        {username:credentials.identifier},

                    ] })
                    if (!user) {
                        throw new Error('User not found')
                    }
                    if(!user.isVarified) {
                        throw new Error('verify your account before the login')

                    }
                  const isPasswordCorrect = await bcrypt.compare(credentials.password.toString(), user.password.toString())
                  if (!isPasswordCorrect) {
                    return user
                  } else{
                    throw new Error('Password is Incorrect, Try again')
                  }


                }catch (err:any){
                    throw new Error(err)


                }


              }
             })

         ],
         callbacks:{
          async jwt ({token, user}) {
            if (user) {
              token.id = user._id?.toString()
              token.username = user.username;
              token.isVerified = user. isVerified;
              token.isAcceotingMessages = user.isAcceotingMessages;
            }
            return token
          },
          async session({session, token}) {
            if (token) {
              
            }
            return session
          },

         },
         pages: {
          signIn: '/sign-in'
         },
         session: {
          strategy:"jwt"
         },
           secret: process.env.NEXTAUTH_SECRET
}