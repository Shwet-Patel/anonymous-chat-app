import { Document } from "mongoose";

export interface candidate extends Document {
    title: string,
    votes: number,
}

export interface poll extends Document {
    pollName: string,
    createdBy: string,
    startDate: Date,
    endDate: Date,
    statement: string,
    description?: string,
    options: candidate[],
    voterIDs: string[],
    isResultPublic: boolean,
}