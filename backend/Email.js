const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.listen(5000, () => console.log("Server Running..."));

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
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const mail = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: "shubham@gmail.com",
        subject: `New mail from ${name}`,
        html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "ERROR" });
        } else {
            res.json({ status: "Message Sent" });
        }
    });
});