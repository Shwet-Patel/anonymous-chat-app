import { Resend } from 'resend';
import verificationEmail from '@/emails/verification-email';
import { AsyncResponse } from '@/types/AsyncResponse';

export async function sendVerificationEmail(username: string, email: string, verifycode: string):Promise<AsyncResponse> {
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Your verification code | True Feedback',
            react: verificationEmail({ name: username, code:verifycode}),
        });
        return {success:true, message:'email sent successfully'};
    } catch (error) {
        console.log('error sending verification email',error);
        return {success:false, message:'error sending verification email'};
    }
}