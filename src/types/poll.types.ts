import { Document } from "mongoose";

export interface candidate extends Document {
    title: string,
    votes: number,
    votePercentage?: number,
}

export interface pollSummary extends Document {
    pollName: string,
    createdAt: Date,
}


export interface poll extends Document {
    pollName: string,
    createdBy: string,
    startDate: Date,
    endDate: Date,
    statement: string,
    description?: string,
    options: candidate[],
    voteCount: number,
    isResultPublic: boolean,
}