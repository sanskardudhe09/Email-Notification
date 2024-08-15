const express = require('express');
const bodyParser = require('body-parser');
const {sendEmail} = require('./emailNotifier');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
//Api for sending email
app.post('/send-email-notification', async (req,res) => {
    const {to, subject, text} = req.body;
    if(!to || !subject || !text){
        return res.status(400).json({Error:"PLease Provide all fields..Some fields are missing"});
    }
    try {
        await sendEmail(to, subject, text);
        res.status(200).send({
            message: "Email Notification sent successfully!!",
            to: to,
            subject: subject,
            time: new Date().toLocaleString()
        })
    } catch (error) {
        res.status(500).send({Error: "Failed to send email notification!!"});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is listening on Port ${port}`);
});