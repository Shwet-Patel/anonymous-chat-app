import { message } from "./user.types";
import { candidate, pollSummary } from "./poll.types";

export interface responsePollDetails {
    _id: string;
    pollName: string;
    createdBy: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    statement: string;
    description?: string;
    options: candidate[];
    voteCount?: number; // Only for creator
    isResultPublic?: boolean; // Only for creator
    winners: candidate[],
    result: string,
}

export interface AsyncResponse {
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: message[],
    messageSuggestions?: string,
    pollDetails?: responsePollDetails,
    pollResults?: responsePollDetails,
    userPollSummary?:pollSummary[],
};