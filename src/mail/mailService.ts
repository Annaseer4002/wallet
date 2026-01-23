import { otpTemplate } from "./templates/otp.js"
import transporter from "./transporter.js";

export const sendOtpEmail = async (email: string, name: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${otp} is Your OTP Code for WalletApp Verification`,
        html: otpTemplate(name, otp)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
}

