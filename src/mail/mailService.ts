import emailTemplate from "./templates/otp.js"
import transporter from "./transporter.js";

export const sendOtpEmail = async (email: string, name: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${otp} is Your OTP Code for WalletApp Verification`,
        html: emailTemplate.otpTemplate(name, otp)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
}


export const sendForgetPasswordEmail = async (name: string, email: string ) => {
        const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Reset ur password`,
        html: emailTemplate.forgetPasswordTemplate(name, email)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`forget password email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending forget password email:', error);
        throw new Error('Could not send forget password email');
    }

}

export const sendResetPasswordEmail = async (name: string, email: string) => {
    const mailOptions = {
       from: process.env.EMAIL_FROM,
       to: email,
       subject: 'Password reset successful',
       html: emailTemplate.resetPasswordTemplate(name)
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent: ${info.response}`);
        
    } catch (error) {
         console.error('Error sending reset password email:', error);
        throw new Error('Could not send reset password email');
    }
}


const sendingMail = {
    sendOtpEmail, sendForgetPasswordEmail, sendResetPasswordEmail
}

export default sendingMail
