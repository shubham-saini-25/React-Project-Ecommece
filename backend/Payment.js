require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/process-payment', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        console.log(req.body);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            // receipt_email: email,
        });

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount,
        //     currency,
        //     receipt_email: 'example@example.com',
        //     billing_details: {
        //         name: 'John Doe',
        //     },
        //     automatic_payment_methods: {
        //         enabled: true,
        //     },
        // });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});