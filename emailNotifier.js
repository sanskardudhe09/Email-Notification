const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

//Primary Email Service
const primaryService = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.primaryEmail,
        pass: process.env.backupPassword,
    }
});

//backup Email Service
//Backup service mail can be from gmail, outlook, yahoo or any mail service
const backupService = nodemailer.createTransport({
    service: process.env.backupService,
    host: "smtp.gmail.com",
    port: 587,
    auth:{
        user: process.env.backupEmail,
        pass: process.env.backupPassword
    }
})

const maxAttempts = 3;

async function sendEmail(to, subject, text, attempt=1){
    try{
        const mailOptions = {
            from: process.env.primaryEmail,
            to: to,
            subject: subject,
            text: text
        };
        await primaryService.sendMail(mailOptions);
        console.log('Email notification sent successfully using primary email service');
    }catch(error){
        console.error('Primary Email Service failed: ', error);
        if(attempt < maxAttempts){
            console.log('Retrying again using Primary Email Service');
            await primaryService.sendEmail(to, subject, text, attempt+1);
        }else{
            console.log('Switching to Backup Email Service');
            try{
                const newmailOptions = {
                    from: process.env.backupEmail,
                    to: to,
                    subject: subject,
                    text: text
                };
                await backupService.sendMail(newmailOptions);
                console.log('Email Notification sent successfully using Backup Email Service');
            }catch(backupErr){
                console.error('Backup Email Service failed: ', backupErr);
                throw new Error('Failed to send email using primary service as well as backup service');
            }
        }
    }
}

module.exports = {sendEmail};