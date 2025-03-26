import { getServerSession } from "next-auth";
import dbConnection from "@/utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

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


    const userId = new mongoose.Types.ObjectId(user._id);
    // console.log("this is it", user._id);
    
    try {
        const queryUser = await UserModel.aggregate([
              { $match : {_id : userId}},
              { $unwind : '$messages'},
              { $sort : {'messages.createdAt':-1}},
              { $group : { _id:'$_id' , messages : {$push:'$messages'} }}
        ]);

        // console.log('works till here...', queryUser);

        if (!queryUser || queryUser.length === 0)
        {
            return Response.json({
                success: false,
                message: 'Your Message box is empty.',
                messages: [],
            }, { status: 201 });
        }

        return Response.json({
            success: true,
            message: 'messages fetched succesfully.',
            messages: queryUser[0].messages,

        }, { status: 201 });
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: 'error in getting messages'
        },{status:500});
    }
}