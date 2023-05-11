const Mongoose = require("mongoose");

const MONGO_URL = process.env.DB_URL;

exports.connect = () => {
    // Connecting to the database
    Mongoose.connect(MONGO_URL, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to database");
    }).catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};