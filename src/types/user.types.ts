import { Document } from "mongoose";

export interface message extends Document {
    content: string,
    createdAt: Date,
};

export interface user extends Document { 
    username: string,
    email: string,
    password: string,
    acceptingMessages: boolean,
    isVerified: boolean,
    verifyCode: string,
    verifyCodeExpiry: Date,
    messages: message[],
};