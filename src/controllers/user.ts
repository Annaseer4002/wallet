import type, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import { sendOtpEmail } from '../mail/mailService.js';
import Wallet from '../model/wallet.js';
import userService from '../services/user.js';
import UserDto from '../dtos/user.js';




export const signup = async (req: Request, res: Response) => {
     const { username, email, password, phoneNumber } : UserDto.SignupDto = req.body;

     try {

          // check if user already exists in the database
          const exisitngUser = await User.findOne({ email });
          if (exisitngUser) {
               return res.status(400).json({
                    status: 'failed',
                    message: 'User already exists'
               });
          }

          // hashed password
          const hashedPassword = await bcrypt.hash(password, 10);

           // generate a 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000);

          // otp Expiry time - 5 minutes from now
          const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
          

          // create a new user
          const newUser = new User({
               walletId: new mongoose.Types.ObjectId(),
               username,
               email,
               phoneNumber,
               password: hashedPassword,
               isVerified: false,
               otpCode: otp,
               otpExpiresAt: otpExpiry
          });

          // save the user to the database
          await newUser.save();

          // creat wallet for the user
           const wallet = new Wallet({
               userId: newUser._id,
               balance: 0,
               status: 'inActive'     
          });
             
          // save wallet to the database
          await wallet.save();

          // update user's walletId
          newUser.walletId = wallet._id;
          await newUser.save();


          // send otp to user's email or phone number
          await sendOtpEmail(email, username, otp.toString());

          // respond with success message
          return res.status(201).json({
               status: 'success',
               message: 'User registered successfully. Please verify your email using the OTP sent.',
               data: {
                    user:{
                    userId: newUser._id,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    username: newUser.username     
                    } ,

                    wallet: {
                    walletbalance: wallet.balance,
                    walletstatus: wallet.status,
                    walletuserId: wallet.userId
               }
               }

              
          });



     } catch (error) {
          return res.status(500).json({
                status: 'error',
                message:  error instanceof Error ? error.message : 'Internal Server Error',
                });
     }
}

export const verifyOtp = async (req: Request, res: Response) => {
     const { email, otpCode } : UserDto.ValidateOtpDto = req.body;

     try { 
    const verifiedUser = await userService.verifyOtpService(email, otpCode);
     
    return res.status(200).json({
          status: 'success',
          message: 'OTP verified successfully, you can now log in.',
          data: {

               // return user details except password and otp fields
              userId: verifiedUser._id,
              walletId: verifiedUser.walletId,
              email: verifiedUser.email,
              username: verifiedUser.username,
                 phoneNumber: verifiedUser.phoneNumber,
               isVerified: verifiedUser.isVerified
          }
     })


} catch (error) {
     return res.status(500).json({
          status: 'error',
          message:  error instanceof Error ? error.message : 'Internal Server Error',
     });
}}



export const resendOtp = async (req: Request, res: Response) => {
     const { email } = req.body;

     try {
          const resendOtp = await userService.resendOtpService(email);
          return res.status(200).json({
               status: 'success',
               message: 'OTP resent successfully. Please check your email.',
          });

     }catch (error) {
          return res.status(500).json({
               status: 'error',
               message:  error instanceof Error ? error.message : 'Internal Server Error',
          });
     }
}


export const deleteUser = async (req: Request, res: Response) => {
     const { userId } = req.params;

     try {
          const deletedUser = await User.findByIdAndDelete(userId);

          if (!deletedUser) {
               return res.status(404).json({
                    status: 'failed',
                    message: 'User not found'
               });
          }

          res.status(200).json({
               status: 'success',
               message: 'User deleted successfully',});

}catch (error) {
     return res.status(500).json({
          status: 'error',
          message:  error instanceof Error ? error.message : 'Internal Server Error',
     });
}}




const UserController = { signup, verifyOtp, resendOtp, deleteUser };
export default UserController;