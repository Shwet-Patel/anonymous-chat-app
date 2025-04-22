import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollModel from "@/models/Poll.model";
import { poll } from "@/types/poll.types";

export async function GET(request:Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    
    const { searchParams } = new URL(request.url || '');
    const pollId = searchParams.get("pollid");
    
    try
    {
        const queryPoll: poll | null = await PollModel.findById(pollId);
        if (!queryPoll) {
            return Response.json({
                success: false,
                message: "can't find poll details. poll id invalid."
            },{status:404})     // 404 Not Found
        }

        const pollDetails : poll = queryPoll.toObject();

        if (!pollDetails.isResultPublic)
        {
            //poll result is private
            if (!user || user.username !== pollDetails.createdBy) {

                //user is not authorized to see the results
                return Response.json({
                    success: false,
                    message: "poll results are private...",
                    
                },{status:403}); // 403 Forbidden
            }
        }
        
        // poll result is public . okay..
        const now = new Date();
        if (now < new Date(pollDetails.startDate)) {
            return Response.json({
                success: false,
                message: 'poll has not started yet'
            }, { status: 423 }); // 423 Locked
        }

        if (now < new Date(pollDetails.endDate)) {
            return Response.json({
                success: false,
                message: 'poll has not ended yet'
            }, { status: 423 }); // 423 Locked
        }


        // it is correct time to share results. now...

        // let's give some more insights.
        const updatedOptions = pollDetails.options.map((candidate) => {
            return {...candidate , votePercentage : (candidate.votes*100)/pollDetails.voteCount}
        });

        updatedOptions.sort((a, b) => b.votes - a.votes); // descending sort based on vote count

        // find winners
        const maxVotes = updatedOptions[0]?.votes || 0;
        const winners = updatedOptions
            .filter(option => option.votes === maxVotes)

        const result = winners.length === 1 ? "winner" : "draw";
        

        return Response.json({
            success: true,
            message: 'poll results fetched successfully',
            pollResults: {...pollDetails, options: updatedOptions , winners , result}
        },{status:200});    // 200 OK

        
    } catch (error) {
        console.log('error in getting poll results',error)
        return Response.json({
            success: false,
            message: 'error in getting poll results',
        },{status:500}); // 500 Internal Server Error
    }

}