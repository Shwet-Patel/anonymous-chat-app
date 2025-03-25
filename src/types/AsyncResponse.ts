import { message } from "./user.types";

export interface AsyncResponse {
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: message[],
    messageSuggestions?:string,
};