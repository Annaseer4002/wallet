import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

(async ()=>{
    try {
        await transporter.verify();
        console.log('Email transporter is ready to send messages');
    } catch (error) {
        console.error('Error with email transporter:', error);
    }
})

();


export default transporter;