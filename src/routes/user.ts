import {Router } from "express";
import UserController from "../controllers/user.js";
import { validateBody } from "../middlewares/validation.js";
import UserDto from "../dtos/user.js";
import authorizationMiddleware from "../middlewares/authorization.js";


const router = Router();


router.post('/signup', validateBody(UserDto.SignupDto),  UserController.signup);
router.post('/verifyOtp', validateBody(UserDto.ValidateOtpDto), UserController.verifyOtp);
router.post('/resendOtp', UserController.resendOtp)
router.post('/login', validateBody(UserDto.loginDto), UserController.login)
router.post('/logout', authorizationMiddleware.Authorization, UserController.logout )
router.post('/forgetPassword', UserController.forgetPassword)
router.post('/resetPassword', validateBody(UserDto.resetPasswordDto), UserController.resetPassword)
router.delete('/deleteUser/:userId', authorizationMiddleware.Authorization, UserController.deleteUser);
router.get('/users', UserController.users)
router.post('/verifyUser/:userId', authorizationMiddleware.Authorization, UserController.verifyUser)

export default router;