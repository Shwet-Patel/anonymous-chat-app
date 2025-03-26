/* register a user */

import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { user } from "@/types/user.types";
import dbConnection from "@/utils/dbConnect";

export async function POST(request: Request) {
    await dbConnection();

    const { username, email, Password } : {username:string, email:string , Password:string} = await request.json();
    const verifyCode = (100000 + Math.floor(Math.random()*900000)).toString();

    try {
        // there was an issue in validation schema before.................

        //check for already existing username 
        const existingUserByUsername: (user | null) = await UserModel.findOne({username:username,isVerified:true});
        if (existingUserByUsername) {
            console.log('this username is taken try something else');
            return Response.json({ success: false, message: 'this username is taken try something else' }, { status: 400 });
        }

        const existingUserByEmail: (user | null) = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified === true) {
                console.log('this email is already registered,login instead');
                return Response.json({ success: false, message: 'this email is already registered,login instead' }, { status: 400 })
            }
            else
            {
                const hashedPassword = await bcrypt.hash(Password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else
        {
            //register fresh user
            const hashedPassword = await bcrypt.hash(Password, 10);
            
            const passwordExpiry = new Date();
            passwordExpiry.setHours(passwordExpiry.getHours() + 1);
            
            
            
            const newUser = new UserModel({username,
                email,
                password: hashedPassword,
                acceptingMessages: true,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: passwordExpiry,
                messages: []
            });
            
            //everything wroks till here...
            await newUser.save();
        }
        
        //send verificationemail
        const emailResponse = await sendVerificationEmail(username, email, verifyCode);
        if (!emailResponse.success) return Response.json(emailResponse, { status: 400 });

        //successfully registered..
        return Response.json({
            success: true,
            message: 'user registered successfully. verify your email',
        },{status:200});

    } catch (error) {
        console.log("error registering user");
        return Response.json({success: false , message: 'error registering user'}, {status:500});
    }

}