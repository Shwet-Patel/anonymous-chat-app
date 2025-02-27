import UserModel from "@/models/User.model";
import dbConnection from "@/utils/dbConnect";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:'Credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: "Username/email", type: "text", placeholder: "Shwet/Shwet@mymail.com" },
                password: {label: "password" , type: "password"}
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnection();

                try {
                    const user = await UserModel.findOne({ $or: [{ username: credentials.identifier }, {email:credentials.identifier}] });

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

                } catch (error:any) {
                    throw new error(error);
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.acceptingMessages = user.acceptingMessages;
                token.username = user.username;
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.User._id = token._id;
                session.User.isVerified = token.isVerified;
                session.User.acceptingMessages = token.acceptingMessages;
                session.User.username = token.username;
            }

            return session;
        }
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy:'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};