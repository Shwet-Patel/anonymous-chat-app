import dbConnection from "@/utils/dbConnect";
import { usernameValidation } from "@/validationSchemas/signupSchema";
import { otpVerificationSchema } from "@/validationSchemas/verifySchema";
import UserModel from "@/models/User.model";

export async function POST(request:Request) {
    await dbConnection();

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const decodedcode = decodeURIComponent(code);

        //zod validation
        const validationResult = usernameValidation.safeParse(decodedUsername);
        if (!validationResult.success)
        {
            const errors = validationResult.error.format()._errors || [];
            return Response.json({
                success: false,
                message: errors.join(','),
            },{status:400});
        }

        const otpValidationResult = otpVerificationSchema.safeParse(decodedcode);
        if (!otpValidationResult.success)
        {
            const errors = otpValidationResult.error.format()._errors || [];
            return Response.json({
                success: false,
                message: errors.join(','),
            },{status:400});
        }

        //finding user
        const queryUser = await UserModel.findOne({ $and: [{ username: decodedUsername }] });
        
        if (!queryUser) {
            return Response.json({
                success: false,
                message: 'user not found. please sign up'
            },{status:404})
        }

        const isCodeCheck = (decodedcode === queryUser.verifyCode);
        const isExpiryCheck = (new Date(queryUser.verifyCodeExpiry) > new Date());

        if (!isCodeCheck)
        {
            return Response.json({
                success: false,
                message: ' wrong verification code'
            }, { status: 400 })
        }
        
        if (!isExpiryCheck)
        {
            return Response.json({
                success: false,
                message: ' verify code expired. signup again'
            }, { status: 400 })
        }

        // user verified...
        queryUser.isVerified = true;
        await queryUser.save();

        return Response.json({
            success: true,
            message: ' user is verified successfully'
        }, { status: 200 })
        
    } catch (error) {
        console.log('error verifying code', error)
        return Response.json({
            success: false,
            message: 'error verifying code',
        },{status:500});
    }
}