import mongoose, { Schema } from "mongoose"; 
import { message, user } from '@/types/user.types';

const MessageSchema: Schema<message> = new mongoose.Schema({
        content: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


const UserSchema: Schema<user> = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"username is required!!"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true,"email is required!!"],
        unique: true,
        match: [ /.+\@.+\..+/ , "enter a valid email address"],
    },
    password:{
        type: String,
        required: [true,"password is required!!"],
    },
    acceptingMessages:{
        type: Boolean,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCode:{
        type: String,
        required: [true,"verify code is required!!"],
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true,"verify code expiry is required!!"],
    },
    messages: [MessageSchema],
    polls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll" // Referencing the Poll model
    }]
}, { timestamps: true });


// because things run on edge in next js then we dont know whether the app is being booted for first time or it is already booted so user schema might already exists so we check it here that's it.
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;