require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require("cors");
const auth = require("./middleware/Auth");

const app = express();
app.use(express.json());
app.use(cors());

const User = require("./models/user");

app.post("/api/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

// API for User Registration
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validate user input
        if (!(name && email && phoneNumber && password)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt the user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name, email: email.toLowerCase(), phoneNumber, password: encryptedPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                password: user.password,

            }, process.env.JWT_TOKEN, { expiresIn: "2h" }
        );

        const response = {
            'status': 201,
            'token': token,
            'message': 'User Registered Succesfully!',
        }

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for User Login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create JWT token
            const token = jwt.sign(
                { user_id: user._id }, process.env.JWT_TOKEN, { expiresIn: "2h" }
            );

            const response = {
                'status': 200,
                'token': token,
                'message': 'User Logged In Succesfully!',
            }

            res.send(response);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for Update Password
app.post("/api/update-password", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user already exists
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).send('User not found');
        }

        //Encrypt the user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        const updatePassword = await User.updateOne({ email }, { password: encryptedPassword });

        // Create JWT token
        const token = jwt.sign(
            { user_id: updatePassword._id }, process.env.JWT_TOKEN, { expiresIn: "2h" }
        );

        const response = {
            'status': 200,
            'token': token,
            'message': 'Password Changed Successfully!',
        }

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;