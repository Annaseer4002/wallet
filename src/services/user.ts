import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendingMail, { sendOtpEmail } from "../mail/mailService.js";
import User from "../model/user.js"
import { activateWalletService } from "./wallet.js";
import Blacklist from "../model/blacklist.js";



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

        // reset otp resend count
        user.otpResendCount = [];

        // activate user wallet
        const activateWallet = await activateWalletService(user.walletId.toString());
        
         

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
        await sendingMail.sendOtpEmail(email, user.username, newOtp);

    // save user
    await user.save();

    return user;
}

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
        throw new Error('User not found');
    }


    // check if user is verified
    if (user.isVerified == false) {
        throw new Error('User is not verified');
    }

    // check if password matches
     const comparedPassword = await bcrypt.compare(password, user.password);
     if (!comparedPassword) {
          throw new Error('Invalid password');
     }

     // wallet details can be populated here if needed
     await user.populate('walletId');

     // generate auth token (JWT) - This can be done in controller or here based on your architecture
     const token = jwt.sign({
            userId: user._id,
            email: user.email
     }, process.env.ACCESS_TOKEN!, { expiresIn: '1h' });

     const refreshToken = jwt.sign({
          userId: user._id,
          email: user.email
     }, process.env.REFRESH_TOKEN!, { expiresIn: '7d' });

    return {user, token, refreshToken};
    

}

export const logoutService = async (req: express.Request) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new Error('No token provided');
    }

    const blacklist = new Blacklist({
        token,
        expiresAt: new Date(Date.now() + 3600 * 1000) // Expires in 1 hour
    });

    await blacklist.save();

    return;
}

export const forgetPasswordService = async (email: string) => {

    // find user
    const user = await User.findOne({email})
    if(!user){
        throw new Error("User not found")
    }

    const resetToken = jwt.sign(
        {id: user.id},
        process.env.RESET_PASSWORD!,
        {expiresIn: '1h'})

    const resetLink = `https://abdulnasir.onrender.com/${resetToken}`

    await sendingMail.sendForgetPasswordEmail(user.username,email)

    return
    
}

export const resetPasswordService = async (email: string, password: string) => {
     
        // find user form the database
        const user = await User.findOne({email})

        // check if user exist
        if(!user){
            throw new Error('User not found')
        }
        
        // check if the user is verified
        if(user.isVerified == false){
           throw new Error('User account is not verified')
        }

        // hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        // update the password to the new hashed password
        user.password = hashedPassword

        await user.save()

        return user

        
}



export const getAllUsersService = async () => {
    const users = await User.find().select('-password').populate('walletId');
     
     if (!users) {
          throw new Error('No users found');
     }

    return users; // 
}


export const verifyUser = async (userId: string) => {
    

    const user = await User.findById(userId)

    // check if user exist
    if(!user){
        throw new Error('user not found')
    }
     
    // mark user verified as true
    user.isVerified = true

    await user.save()

    return user
}


const userService = {
     verifyOtpService, 
     resendOtpService, 
     loginService, 
     logoutService, 
     forgetPasswordService, 
     resetPasswordService, 
     getAllUsersService,
     verifyUser
}
export default userService