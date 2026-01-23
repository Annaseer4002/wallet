import { 
    IsEmail, 
    IsString, 
    IsNotEmpty, 
    MinLength, 
    MaxLength, 
    IsPhoneNumber, 
    Length
} from "class-validator";

export class SignupDto { // Convention: Use PascalCase for Classes
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username!: string;

    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsPhoneNumber("NG", { message: 'Invalid phone number, please enter a valid Nigerian phone number' })
    phoneNumber!: string; // Matches your IUser model

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password must be less than 100 characters long' })
    password!: string;
}

export class ValidateOtpDto {
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string;



    @IsString()
    @IsNotEmpty({ message: 'OTP is required' })
    @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
    otpCode!: string;
}



export default {
    SignupDto,
    ValidateOtpDto
}
