const Mongoose = require("mongoose");

const orders = new Mongoose.Schema({
    _id: { type: Object, required: true },
    paymentIntentId: { type: String, required: true },
    userId: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    orderDate: { type: String, required: true },
    isReturned: { type: Boolean, required: true, default: false },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = Mongoose.model('Orders', orders);