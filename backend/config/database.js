const Mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

exports.connect = () => {
    Mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database");
    }).catch((error) => {
        console.error("Database connection failed. Exiting now...");
        console.error(error);
        process.exit(1);
    });

    Mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
    });
};