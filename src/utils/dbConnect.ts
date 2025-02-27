import mongoose from "mongoose";

let isConnected:number = 0;

async function dbConnection():Promise<void> {
    
    if (isConnected) {
        console.log('already connected to db');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '');
        // console.log(db);
        isConnected = db.connections[0].readyState;
        console.log('db Connection success');

    } catch (error) {
        console.log('db connection failed' ,error);
        process.exit();
    }
}

export default dbConnection;