import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import PollModel from "@/models/Poll.model";

export async function POST(request:NextRequest) {
    await dbConnection();

    // check user is logged in...
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user)
    {
        return Response.json({
            success: false,
            message: 'authentication error.'
        },{status:401});
    }

    const { pollID, resultStatus } = await request.json();

    try {

        // update only if the logged-in user is the creator
        const updateResult = await PollModel.updateOne(
            { _id: pollID, createdBy: user.username },
            {isResultPublic: resultStatus} // update the isResultPublic field
        ); 
        
        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Poll not found or you don't have permission to update it."
            }, { status: 403 });
        }
        
        
        return Response.json({
            success: true,
            message: 'poll results access status updated succesfully.',
        }, { status: 200 });
        
    } catch (error) {
        console.log('error in changing poll results acess status',error)
        return Response.json({
            success: false,
            message: 'error in changing poll results acess status',
        },{status:500});
    }

}