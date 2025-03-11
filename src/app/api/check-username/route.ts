import UserModel from "@/models/User.model";
import dbConnection from "@/utils/dbConnect";
import { usernameValidation } from "@/validationSchemas/signupSchema";

export async function GET(request:Request) {
    await dbConnection();

    try {
        
        const queryName = new URL(request.url).searchParams.get('username');
        
        const validationResult = usernameValidation.safeParse(queryName);
        if (!validationResult.success)
        {
            const errors = validationResult.error.format()._errors || [];
            return Response.json({
                success: false,
                message: errors.join(','),
            },{status:400});
        }

        const queryUser = await UserModel.findOne({ $and: [{ username: queryName }, { isVerified: true }] });
        if (queryUser) {
            return Response.json({
                success: false,
                message: 'This username is already taken. try something else'
            },{status:400})
        }
        
        return Response.json({
            success: true,
            message: 'This username is available'
        }, { status: 200 })
    
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json({
            success: false,
            message: 'error checking username',
        },{status:500})
    }
}