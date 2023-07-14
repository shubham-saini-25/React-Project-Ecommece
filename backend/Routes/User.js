const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// API for get the total users count
router.get("/api/get-user-count", async (req, res) => {
    try {
        const totalUserCount = await User.countDocuments({ role: 'Customer' });
        res.status(200).json({ totalUserCount });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for User Registration
router.post("/api/register", async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validate user input
        if (!(name && email && phoneNumber && password)) {
            res.status(400).send("All input is required");
            return;
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
            name, email: email.toLowerCase(), role: 'Customer', phoneNumber, password: encryptedPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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
router.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user irolenput
        if (!(email && password)) {
            res.status(400).send("All input is required");
            return;
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
                'userId': user._id,
                'role': user.role,
                'message': 'User Logged In Succesfully!',
            }

            res.send(response);
            return;
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for Update Password
router.post("/api/update-password", async (req, res) => {
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

// API for update customer details
router.post('/api/update-user/:id', async (req, res) => {
    try {
        const admin = await User.find();

        if (admin[0].role === 'Admin') {
            const userId = req.params.id;
            const user = await User.findById(userId);

            // Check if the user exists
            if (!user) {
                return res.status(404).send('User Not Found');
            }

            // Update the user based on the request body
            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.phoneNumber) {
                user.phoneNumber = req.body.phoneNumber;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }

            // Save the updated user data
            const updatedUser = await user.save();

            res.status(200).json({ user: updatedUser, message: 'User Updated Succesfully!' });
        } else {
            res.status(401).send('Unauthorized User');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for deleting a user by ID
router.delete('/api/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// API for getting all customer details for Admin
router.get('/api/get-users', async (req, res) => {
    try {
        const admin = await User.find();

        if (admin[0].role === "Admin") {

            const user = await User.find();
            if (!user) {
                res.status(404).send('User Not Found');
            }

            res.status(200).json({ user });
        } else {
            res.status(401).send('Unauthorised User');
        }

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for getting one customer details
router.get('/api/get-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.find({ _id: userId });

        if (!user) {
            return res.status(404).send('User Not Found');
        }

        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;