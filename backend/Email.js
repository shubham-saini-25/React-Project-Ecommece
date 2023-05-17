const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.listen(5000, () => console.log("Server Running..."));

const fs = require('fs');
const ejs = require('ejs');
// Read the EJS template file
const mailTemplate = fs.readFileSync('./Email-Templates/contactMail.ejs', 'utf-8');

const contactEmail = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

contactEmail.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post("/send-mail", (req, res) => {

    const dynamicData = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    const filledTemplate = ejs.render(mailTemplate, dynamicData);

    const mail = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: "shubham@gmail.com",
        subject: `contact us query mail`,
        html: filledTemplate,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "ERROR" });
        } else {
            res.json({ status: "Message Sent" });
        }
    });
});