const Mongoose = require("mongoose");

const products = new Mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
});

module.exports = Mongoose.model('Products', products);