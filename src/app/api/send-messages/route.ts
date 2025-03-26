import dbConnection from "@/utils/dbConnect";
import UserModel from "@/models/User.model";
import { message, user } from "@/types/user.types";

export async function POST(request:Request) {
    await dbConnection();

    const { username, content } = await request.json();

    try {
        const user: user | null = await UserModel.findOne({ username: username });

        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 404 });
        }

        if (!user.acceptingMessages)
        {
            return Response.json({
                success: false,
                message:'user not accepting messages.'
            },{status:400});
        }

        user.messages.push({ content: content } as message);
        user.save();

        return Response.json({
            success: true,
            message: 'message sent successfully...'
        });

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'error sending message.'
        },{status:500});
    }
}