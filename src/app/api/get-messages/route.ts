import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { user } from "@/types/user.types";
import mongoose from "mongoose";

export async function GET(request:Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const queryUser = await UserModel.aggregate([
            { $match : {_id : userId}},
            { $unwind : '$messages'},
            { $sort : {'$messages.createdAt':-1}},
            { $group : { _id:'$_id' , messages : {$push:'$messages'} }}
        ]);

        if (!queryUser || queryUser.length === 0)
        {
            return Response.json({
                success: false,
                message: 'user not found',
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: 'messages fetched succesfully.',
            result: queryUser[0].messages,

        }, { status: 201 });
        
    } catch (error) {
        console.log('error in getting messages')
        return Response.json({
            success: false,
            message: 'error in getting messages'
        },{status:500});
    }
}