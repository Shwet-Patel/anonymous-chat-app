import mongoose, { Schema } from "mongoose"; 
import { candidate, poll } from "@/types/poll.types";

const CandidateSchema: Schema<candidate> = new mongoose.Schema({
    title: {
        type: String,
        required:[true, "candidate title is required!!"],
    },
    votes: {
        type: Number,
        default: 0
    }
});

const PollSchema: Schema<poll> = new mongoose.Schema({
    pollName: {
        type: String,
        required: [true, "pollName is required!!"],
        trim: true,
    },
    createdBy: {
        type: String,
        required: [true, "poll creator's name is required!!"],
        trim: true,
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, "end date is required!!"],
    },
    statement: {
        type: String,
        required: [true, "statement is required!!"],
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    options: {
        type: [CandidateSchema],
        required: [true, "options are required!!"],

    },
    voteCount: {
        type: Number,
        default: 0,
    },
    isResultPublic: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

const PollModel = mongoose.models.Poll || mongoose.model('Poll', PollSchema);
export default PollModel;