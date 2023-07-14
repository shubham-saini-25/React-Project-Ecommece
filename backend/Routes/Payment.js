const express = require("express");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orders");
const { ObjectId } = require('mongodb');

router.post('/api/process-payment', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

router.post('/api/return-item/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findById(new ObjectId(orderId));

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const paymentIntentId = order.paymentIntentId;
        const orderAmount = order.amount;

        if (!paymentIntentId) {
            return res.status(404).json({ error: 'PaymentIntent not found for this order' });
        }

        // Retrieve the payment intent using the paymentIntentId
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const refund = await stripe.refunds.create({
            charge: paymentIntent.latest_charge,
            amount: orderAmount,
        });

        if (refund.status === 'succeeded') {
            order.isReturned = true;
        }
        await order.save();

        res.send({ order });
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).send({ error: 'Failed to retrieve order' });
    }
});

module.exports = router;