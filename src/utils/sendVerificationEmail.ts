import nodemailer from "nodemailer";
import { render } from '@react-email/render';
import verificationEmail from '@/emails/verification-email';
import { AsyncResponse } from '@/types/AsyncResponse';

export async function sendVerificationEmail(username: string, email: string, verifycode: string): Promise<AsyncResponse> {
    try {
        // Create transporter with Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Convert React Email component to HTML
        const emailHtml = await render(verificationEmail({ name: username, code: verifycode }));

        // Send email
        await transporter.sendMail({
            from: `"True Feedback" <${process.env.GMAIL_USER}>`, // Use your Gmail
            to: email,
            subject: 'Your verification code | True Feedback',
            html: emailHtml, // Rendered HTML email
        });

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.log('Error sending verification email:', error);
        return { success: false, message: 'Error sending verification email' };
    }
}














// import { Resend } from 'resend';
// import verificationEmail from '@/emails/verification-email';
// import { AsyncResponse } from '@/types/AsyncResponse';

// export async function sendVerificationEmail(username: string, email: string, verifycode: string):Promise<AsyncResponse> {
    
//     const resend = new Resend(process.env.RESEND_API_KEY);
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: [email],
//             subject: 'Your verification code | True Feedback',
//             react: verificationEmail({ name: username, code:verifycode}),
//         });
//         return {success:true, message:'email sent successfully'};
//     } catch (error) {
//         console.log('error sending verification email',error);
//         return {success:false, message:'error sending verification email'};
//     }
// }