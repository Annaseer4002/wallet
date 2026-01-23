import { sendOtpEmail } from "../mail/mailService.js";
import User from "../model/user.js"


export const verifyOtpService = async (email: string, otpCode: string) => {
        
     const user = await User.findOne({ email })

     // check if user exists
     if (!user) {
          throw new Error('User not found');
     }

     // check if user is already verified
     if (user.isVerified) {
          throw new Error('User is already verified');
     }

     // check if otp is set
     if (!user.otpCode) {
          throw new Error('OTP not found. Please request a new one.');
     }

    // check if otp matches
    if (user.otpCode !== otpCode) {
             throw new Error('Invalid OTP');
     }

        // check if otp is expired
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
             throw new Error('OTP has expired, please request a new one.');
        }

        // mark user as verified
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;


        // save user
        await user.save();

        return user;
}


export const resendOtpService = async (email: string) => {
    const user = await User.findOne({ email })


    // check if user exists
    if(!user){
        throw new Error('User not found');
    }

    // check if user is already verified
     if (user.isVerified) {
          throw new Error('User is already verified');
     }

     // check if otp is already set and not expired
     if (user.otpCode && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
          throw new Error('An active OTP already exists. Please check your email.');
     }

     // wait at least 1 minute before requesting resending OTP
        const now = Date.now();
        const oneMinute = 1 * 60 * 1000;

        if(now - user.updatedAt?.getTime() < oneMinute){
            throw new Error('Please wait at least 1 minute before requesting a new OTP.');
        }
      
        // 5 otp resend per hour
        const oneHourAgo = new Date(now - 60 * 60 * 1000);

        // filter out timestamps older than one hour
        user.otpResendCount = user.otpResendCount?.filter(timestamp => timestamp > oneHourAgo) || [];

        // check if user has exceeded resend limit
        if (user.otpResendCount.length >= 5) {
            throw new Error('You have reached the maximum number of OTP resend requests. Please try again later.');
        }

    // generate a new 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // set new otp expiry time - 5 minutes from now
    const newOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // update user with new otp and expiry
    user.otpCode = newOtp;
    user.otpExpiresAt = newOtpExpiry;
    user.otpResendCount.push(new Date());

        // send otp to user's email or phone number
        await sendOtpEmail(email, user.username, newOtp);

    // save user
    await user.save();

    return user;
}


const userService = {
     verifyOtpService, resendOtpService
}
export default userService