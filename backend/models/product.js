const Mongoose = require("mongoose");

const addProduct = new Mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
});

module.exports = Mongoose.model('Products', addProduct);