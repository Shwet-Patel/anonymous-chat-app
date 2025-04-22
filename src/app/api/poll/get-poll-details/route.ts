import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollModel from "@/models/Poll.model";
import { candidate, poll } from "@/types/poll.types";

export async function GET(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    const { searchParams } = new URL(request.url || '');
    const pollId = searchParams.get("pollid");
    
    try
    {
        const pollDetails: poll | null = await PollModel.findOne({ _id: pollId });
        if (!pollDetails) {
            return Response.json({
                success: false,
                message: "can't find poll details. poll id invalid."
            },{status:400})
        }

        if (user && user.username === pollDetails.createdBy) {
            //creator of the poll... send all the details
            return Response.json({
                success: true,
                message: "poll details fetched successfully",
                pollDetails
            });
        }
        else
        {
            const filteredPollDetails = pollDetails.toObject();
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { voteCount, isResultPublic, ...publicDetails } = filteredPollDetails;           

            // remove vote counts from options
            const sanitizedOptions = publicDetails.options.map((option: candidate) => ({
                title: option.title,
                // exclude 'votes'
            }));

            return Response.json({
                success: true,
                message: "poll details fetched successfully",
                pollDetails: {
                    ...publicDetails,
                    options: sanitizedOptions
                }
            });
        }
        
    } catch (error) {
        console.log('error in getting poll details',error)
        return Response.json({
            success: false,
            message: 'error in getting poll details',
        },{status:500});
    }
}