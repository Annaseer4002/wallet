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