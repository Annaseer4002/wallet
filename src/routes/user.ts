import {Router } from "express";
import UserController from "../controllers/user.js";
import { validateBody } from "../middlewares/validation.js";
import UserDto from "../dtos/user.js";


const router = Router();


router.post('/signup', validateBody(UserDto.SignupDto),  UserController.signup);
router.post('/verifyOtp', validateBody(UserDto.ValidateOtpDto), UserController.verifyOtp);

router.delete('/deleteUser/:userId', UserController.deleteUser);

export default router;