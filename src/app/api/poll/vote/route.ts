import dbConnection from "@/utils/dbConnect";
import PollModel from "@/models/Poll.model";
import { poll } from "@/types/poll.types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request:Request) {
    await dbConnection();
    
    const { pollID, chosenCandidate } = await request.json();
    const cookieStore = await cookies();
    const cookieName = `voted-for-${pollID}`;


    try {
        const queryPoll: poll | null = await PollModel.findById(pollID);

        if (!queryPoll) {
            return Response.json({
                success: false,
                message: 'poll-id is not valid'
            }, { status: 404 });
        }

        // Duration check using startDate and endDate
        const now = new Date();

        if (now < new Date(queryPoll.startDate)) {
            return Response.json({
                success: false,
                message: 'poll has not started yet'
            }, { status: 403 });
        }

        if (now > new Date(queryPoll.endDate)) {
            return Response.json({
                success: false,
                message: 'poll has ended'
            }, { status: 403 });
        }

        // check already voted by finding stored cookie
        const alreadyVoted = cookieStore.has(cookieName);

        if (alreadyVoted) {
            console.log("caught ya!! repeated vote..")
            return Response.json({
                success: true,
                message: "vote added successfully...",
            }, { status: 201 });
        }

        //vote
        let hasFoundCandidate = false;
        queryPoll.options.map((candidate) => {
            if (candidate.title === chosenCandidate)
            {
                hasFoundCandidate = true;
                candidate.votes = candidate.votes + 1;
                queryPoll.voteCount = queryPoll.voteCount + 1;
            }
        });

        if (!hasFoundCandidate)
        {
            return Response.json({
                success: false,
                message: "no such candidate found..",
            },{status: 404});
        }

        //save
        queryPoll.save();

        //Set cookie after successful vote
        const response = NextResponse.json({
            success: true,
            message: 'vote added successfully...',
        }, { status: 201 });

        response.cookies.set(cookieName, "yes", {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 60, // 2 months
            sameSite: "strict",
            secure: false, // Set to true if using HTTPS
        });

        return response;

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'error voting for this'
        },{status:500});
    }
}