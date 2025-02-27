import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { user } from "@/types/user.types";

export async function POST(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);
    const user = session?.User;

    if (!session || !user)
    {
        return Response.json({
            success: false,
            message: 'authentication error.'
        },{status:401});
    }

    const userId = user._id;
    const { acceptingMessages } = await request.json();

    try {
        const queryUser: user | null = await UserModel.findByIdAndUpdate(userId, { acceptingMessages: acceptingMessages }, { new: true });
        
        if (!queryUser)
        {
            return Response.json({
                success: false,
                message: 'user not found',
            }, { status: 400 });
        }

        session.User.acceptingMessages = acceptingMessages; // update also in session
        return Response.json({
            success: true,
            message: 'accepting messages status updated successfully.',
        }, { status: 201 });
        
    } catch (error) {
        console.log('error in updating accepting messages status')
        return Response.json({
            success: false,
            message: 'error in updating accepting messages status'
        },{status:500});
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const user = session?.User;

    if (!session || !user)
    {
        return Response.json({
            success: false,
            message: 'authentication error.'
        },{status:401});
    }

    const userId = user._id;
    const isAcceptingMessages = user.acceptingMessages; // we are not doing dbquery. we are directly serving data from the session.

    return Response.json({
        success: true,
        message: 'value read successfully from the session',
        isAcceptingMessages,
    },{status:200});
}