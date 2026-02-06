import type, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import sendingMail, { sendOtpEmail } from '../mail/mailService.js';
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
          await sendingMail.sendOtpEmail(email, username, otp.toString());

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

           // clear otpCode, otpExpiresAt, and otpResendCount to the database after successful resend
          resendOtp.otpCode = undefined;
          resendOtp.otpExpiresAt = undefined;
          resendOtp.otpResendCount = [];

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

export const login = async (req: Request, res: Response) => {
     const { email, password } : UserDto.loginDto = req.body;

     try {

          const { user, token, refreshToken } = await userService.loginService(email, password);
          // console.log(user);

          return res.status(200).json({
               status: 'success',
               message: 'Login successful.',
               user: {
                    userId: user._id,
                    walletId: user.walletId,
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    isVerified: user.isVerified
               },
               token,
               refreshToken
               // data: {
               //      userId: user._id,
               //      walletId: user.walletId,
               //      email: user.email,
               //      username: user.username,
               //      phoneNumber: user.phoneNumber,
               //      isVerified: user.isVerified
               // }
               
          });

     }catch (error) {
          return res.status(500).json({
               status: 'error',
               message:  error instanceof Error ? error.message : 'Internal Server Error',
          });
     }
}

export const logout = async (req: Request, res: Response) => {
     const blacklist = await userService.logoutService(req);

     try {
          return res.status(200).json({
               status: 'success',
               message: 'Logout successful.'
          });
}catch (error) {
     return res.status(500).json({
          status: 'error',
          message:  error instanceof Error ? error.message : 'Internal Server Error',
     });
} }

export const forgetPassword = async (req: Request, res: Response)=>{
     const {email} : UserDto.forgetPasswordDto = req.body

     try {

          const forgetPassword = await userService.forgetPasswordService(email)

        return res.status(200).json({
               status:'success',
               message:'We`ve sent you a mail, Please check your email to reset your password',
          })
          
     } catch (error) {
            return res.status(500).json({
          status: 'error',
          message:  error instanceof Error ? error.message : 'Internal Server Error',
     });
     }
}

export const resetPassword = async (req: Request, res: Response) => {
     const { email, password}: UserDto.resetPasswordDto = req.body

     try {

          const resetPassword = await userService.resetPasswordService(email, password)

          await sendingMail.sendResetPasswordEmail(resetPassword.username, email)

          res.status(200).json({
               status: 'success',
               message:'Password reset successfully, please login'
          })
          
     } catch (error) {
          return res.status(500).json({
               status: 'error',
               message: error instanceof Error ? error.message : 'internal server error',
          })
     }
}

export const users = async (req: Request, res: Response) => {
     try {

          const allUsers = await userService.getAllUsersService();

          return res.status(200).json({
               status: 'success',
               message: 'Users retrieved successfully.',
               data: allUsers
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


export const verifyUser = async (req: Request, res: Response) => {
     const {userId} = req.params

     try {

          const verifyUser = await userService.verifyUser(userId.toString())

          if(!verifyUser){
          return res.status(404).json({
                    status:'failed',
                    message: 'failed to verify user'
               })
          }

          res.status(200).json({
               status:'success',
               message:'user account verified successful'
          })
          
     } catch (error) {
        return  res.status(500).json({
               status: 'error',
               message: error instanceof Error ? error.message: 'Internal serve error'
          })
     }
}



const UserController = { signup,
      verifyOtp,
     resendOtp,
     login,
     logout,
     forgetPassword,
     resetPassword,
     users, 
     deleteUser,
verifyUser };
export default UserController;