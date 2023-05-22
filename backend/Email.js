const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
require('dotenv').config();

const fs = require('fs');
const ejs = require('ejs');
// Read the EJS template file
const contactMailTemplate = fs.readFileSync('./Email-Templates/contactMail.ejs', 'utf-8');
const invoiceMailTemplate = fs.readFileSync('./Email-Templates/orderInvoiceMail.ejs', 'utf-8');

const contactEmail = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

contactEmail.verify(function (error) {
    if (error) {
        console.log(error);
    }
});

router.post("/api/send-mail", (req, res) => {

    const dynamicData = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    const emailTemplate = ejs.render(contactMailTemplate, dynamicData);

    const mail = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: "shubham@gmail.com",
        subject: 'contact us query mail',
        html: emailTemplate,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "ERROR" });
        } else {
            res.json({ status: "Message Sent" });
        }
    });
});

router.post("/api/send-invoice", (req, res) => {
    try {

        const dynamicData = {
            invoiceNumber: req.body.invoiceNumber,
            date: req.body.dateTime.split("at")[0],
            time: req.body.dateTime.split("at")[1],
            name: req.body.customerDetails.name,
            email: req.body.customerDetails.email,
            phone: req.body.customerDetails.phone,
            line1: req.body.customerDetails.line1,
            line2: req.body.customerDetails.line2,
            city: req.body.customerDetails.city,
            state: req.body.customerDetails.state,
            country: req.body.customerDetails.country,
            postal_code: req.body.customerDetails.postal_code,
            cartTotal: parseFloat(req.body.cartTotal),
            shippingCharges: parseFloat(req.body.shippingCharges),
            totalAmount: parseFloat(req.body.cartTotal + req.body.shippingCharges),
            items: req.body.items,
        };

        const emailTemplate = ejs.render(invoiceMailTemplate, dynamicData);

        const mail = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: req.body.customerDetails.email,
            subject: 'order invoice',
            html: emailTemplate,
        };

        contactEmail.sendMail(mail, (error) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(200).json({ message: 'Invoice successfully sent to your email' });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;