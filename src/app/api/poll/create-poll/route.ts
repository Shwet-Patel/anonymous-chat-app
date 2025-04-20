import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import PollModel from "@/models/Poll.model";
import { user } from "@/types/user.types";
import UserModel from "@/models/User.model";

type requestbody = {
    username: string,
    pollName: string,
    startDate: Date,
    endDate: Date,
    statement: string,
    description: string,
    candidates: string[],
    isResultPublic: boolean,
}

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

    const {username, pollName , startDate , endDate , statement, description , candidates , isResultPublic} : requestbody = await request.json();
    const options = candidates.map((candidate) => { return {title: candidate , votes : 0} });


    try {
        const user: user | null = await UserModel.findOne({ username: username });
        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 404 });
        }

        const newPoll = new PollModel({
            pollName,
            createdBy: username,
            startDate,
            endDate,
            statement,
            description,
            options,
            voteCount: 0,
            isResultPublic,
        });

        const savedPoll = await newPoll.save();
        //console.log("this is poll.......",savedPoll);

        user.polls.push(savedPoll._id);
        const newUser = await user.save();

        //console.log("this is user.........",newUser);

        return Response.json({
            success: true,
            message: 'poll created succesfully.',
        }, { status: 200 });
        
    } catch (error) {
        console.log('error in creating poll',error)
        return Response.json({
            success: false,
            message: 'error in creating poll',
        },{status:500});
    }

}