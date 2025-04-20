import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import PollModel from "@/models/Poll.model";
import UserModel from "@/models/User.model";

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

    const { pollID } = await request.json();


    try {

        // Delete poll only if the logged-in user is the creator
        const deleteResult = await PollModel.deleteOne({
            _id: pollID,
            createdBy: user.username // Ensure only the creator can delete
        });
        
        if (deleteResult.deletedCount === 0) {
            return Response.json({
                success: false,
                message: "Poll not found or you don't have permission to delete it."
            }, { status: 403 });
        }
        
        //update the user's document
        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { polls: pollID } });
        
        return Response.json({
            success: true,
            message: 'poll deleted succesfully.',
        }, { status: 200 });
        
    } catch (error) {
        console.log('error in deleting poll',error)
        return Response.json({
            success: false,
            message: 'error in deleting poll',
        },{status:500});
    }

}