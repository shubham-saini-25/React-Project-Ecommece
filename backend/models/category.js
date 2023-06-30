const Mongoose = require("mongoose");

const category = new Mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
});

module.exports = Mongoose.model('Category', category);