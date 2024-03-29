const Mongoose = require("mongoose");

const users = new Mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = Mongoose.model('Users', users);