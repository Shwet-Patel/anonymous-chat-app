import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";


export async function POST(request:NextRequest ) {
    await dbConnection();

    const body = await request.json();
    const msgId = body.messageid;
    
    const session = await getServerSession(authOptions);
    const user = session?.user;


    if (!session || !user)
    {
        return Response.json({
            success: false,
            message: 'authentication error.'
        },{status:401});
    }


    try {

        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: msgId } } });
        
        if (updatedResult.modifiedCount == 0)
        {
            return Response.json({
                success: false,
                message: 'error in deleting message'
            },{status:400});
        }


        return Response.json({
            success: true,
            message: 'message deleted succesfully.',
        }, { status: 200 });
        
    } catch (error) {
        console.log('error in deleting message',error)
        return Response.json({
            success: false,
            message: 'error in deleting message'
        },{status:500});
    }
}