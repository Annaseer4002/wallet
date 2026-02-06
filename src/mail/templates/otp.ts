export const otpTemplate = (name: string, otp: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #4A90E2;">Verify Your Account</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for joining <b>WalletApp</b>. Use the code below to verify your account:</p>
        <div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
        </div>
        <p>This code expires in 5 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
    </div>
    `;
};


export const forgetPasswordTemplate = (name: string, resetLink: string) => {
    
   return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 10px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #11447e; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Reset Your Password</h2>
            </div>

            <div style="padding: 30px; color: #333333; line-height: 1.6;">
                <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
                <p>We received a request to reset your password for your <b>WalletApp</b> account. Click the button below to proceed:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #11447e; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                       Reset Password
                    </a>
                </div>

                <p style="font-size: 14px; color: #666666;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
                
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
                
                <p style="font-size: 12px; color: #999999; text-align: center; margin: 0;">
                    &copy; 2026 WalletApp Team. All rights reserved.
                </p>
            </div>
        </div>
    </div>`;
};

export const resetPasswordTemplate = (name: string) => {
      return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 10px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #11447e; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Successfully Reset Password</h2>
            </div>

            <div style="padding: 30px; color: #333333; line-height: 1.6;">
                <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
                <p>you successfully reset your password for your <b>WalletApp</b> account. the best app to stay safe, please login.</p>


                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
                
                <p style="font-size: 12px; color: #999999; text-align: center; margin: 0;">
                    &copy; 2026 WalletApp Team. All rights reserved.
                </p>
            </div>
        </div>
    </div>`;
}



const emailTemplate = {
    otpTemplate, forgetPasswordTemplate, resetPasswordTemplate
}


export default emailTemplate