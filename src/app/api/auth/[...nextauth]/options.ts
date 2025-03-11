import UserModel from "@/models/User.model";
import dbConnection from "@/utils/dbConnect";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: "Username/email", type: "text"},
                password: {label: "password" , type: "password"}
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnection();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                          { email: credentials.identifier },
                          { username: credentials.identifier },
                        ],
                      });
                    
                    if (!user)
                    {
                        throw new Error('cant find user. first register please.');
                    }

                    if (user.isVerified === false)
                    {
                        throw new Error('user is not verfied. please verify user before login');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error('wrong password. please remember your passwords well');
                    }
                    
                    return user;

                } catch (error: any) {
                    // console.log('i kneew it.', error);
                    throw new Error(error);
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.acceptingMessages = user.acceptingMessages;
                token.username = user.username;
            }
            
            //console.log("this is token", token);
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.acceptingMessages = token.acceptingMessages;
                session.user.username = token.username;
            }


            return session;
        }
    },
    // pages: {
    //     signIn: '/hellooo',
    // },     may be this is not needed..
    session: {
        strategy:'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};