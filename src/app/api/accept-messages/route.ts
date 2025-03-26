import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { user } from "@/types/user.types";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);
    const user = session?.user;

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

        session.user.acceptingMessages = acceptingMessages; // update also in session
        return Response.json({
            success: true,
            message: 'accepting messages status updated successfully.',
        }, { status: 201 });
        
    } catch (error) {
        console.log('error in updating accepting messages status',error)
        return Response.json({
            success: false,
            message: 'error in updating accepting messages status'
        },{status:500});
    }
}

export async function GET(request: NextRequest) {
    await dbConnection();

    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    //console.log('works till here...',username);

    try {
        const queryUser : user | null = await UserModel.findOne({ username: username });
        if (!queryUser) {
            return Response.json({
                success: false,
                message: 'user not found',
            }, { status: 400 });
        }

        const isAcceptingMessages: boolean = queryUser.acceptingMessages;
        return Response.json({
            success: true,
            message: 'value read successfully..',
            isAcceptingMessages,
        },{status:200});

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: 'error getting accept message status',
        }, { status: 500 });
        
    }
    
    
    // const isAcceptingMessages = user.acceptingMessages;
    // we are not doing dbquery. we are directly serving data from the session.
    // update : we will have to do dbquery coz this route will also be called 
    //          from public message board where user might not have logged in.

}