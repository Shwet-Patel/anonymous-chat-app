import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollModel from "@/models/Poll.model";
import UserModel from "@/models/User.model";

export async function GET() {
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

    try
    {
        const queryuser = await UserModel.findById(user._id).select('polls');
        if (!queryuser) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 404 });
        }

        // console.log("this is queryuser",queryuser);

        const userPollSummary = await PollModel.find({ _id: { $in: queryuser.polls } })
            .select('pollName createdAt');
        
        // if (!userPollSummary || userPollSummary.length === 0)
        // {
        //     return Response.json({
        //         success: false,
        //         message: "You have not created any polls",
                
        //     }, { status: 201 });
        // }

        return Response.json({
            success: true,
            message: 'poll details fetched succesfully.',
            userPollSummary: userPollSummary,

        }, { status: 201 });

        
    } catch (error) {
        console.log('error in getting poll details',error)
        return Response.json({
            success: false,
            message: 'error in getting poll details',
        },{status:500});
    }


}