import { GoogleGenerativeAI , SchemaType } from '@google/generative-ai';
import { json } from 'node:stream/consumers';

export async function GET(request: Request) {
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "Your job is to suggest questions for an anonymous social messaging platform like Qooh.me. Avoid personal or sensitive topics.Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. return response in a single string where each response is separated by a ||. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?",
        });

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string.";
        const result = await model.generateContent(prompt);

        if (!result || !result.response.candidates) {
            return Response.json({
                success: false,
                message: 'error fetching suggestions from Google AI Studio',
            },{status:500})
        }

        const messages = result.response.candidates[0].content.parts[0].text;

        return Response.json({
            success: true,
            message: 'message suggestions generated successfully',
            messages
        },{status:200});

    } catch (error) {
        console.log('error getting suggestions');
        return Response.json({
            success: false,
            message: 'error getting suggestions'
        },{status:500})
    }
}



