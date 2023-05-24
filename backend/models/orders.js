const Mongoose = require("mongoose");

const orders = new Mongoose.Schema({
    _id: { type: Object, required: true },
    buyerId: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    orderDate: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
});

module.exports = Mongoose.model('Orders', orders);