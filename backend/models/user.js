const Mongoose = require("mongoose");

const users = new Mongoose.Schema({
    name: { type: String, required: true },
    purpose: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = Mongoose.model('Users', users);