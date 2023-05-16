require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require("cors");
const auth = require("./middleware/Auth");

// module for uploading product image 
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cb) => { cb(null, file.originalname) },
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve("./uploads")));

const User = require("./models/user");
const Product = require("./models/product");

app.post("/api/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

// API for User Registration
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, purpose, phoneNumber, password } = req.body;

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
            name, email: email.toLowerCase(), purpose, phoneNumber, password: encryptedPassword,
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                purpose: user.purpose,
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

// API for Add New Products
app.post("/api/add-products", upload.single('image'), async (req, res) => {
    try {
        const name = req.body.name;
        const price = parseFloat(req.body.price);
        const description = req.body.description;
        const image = req.file.originalname;

        // Validate product information input
        if (!(name && description && price && image)) {
            res.status(400).send("All input is required");
        }

        const newProduct = await Product.create({
            name, description, price, image,
        });

        const response = {
            'status': 200,
            'product': newProduct,
            'message': 'New Product Added successfully!',
        }

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for Update Product
app.post("/api/update-product/:id", upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;

        // Retrieve the existing product from the database
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Update the product fields with the new values (if provided)
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.price) {
            product.price = parseFloat(req.body.price);
        }
        if (req.body.description) {
            product.description = req.body.description;
        }
        if (req.file) {
            product.image = req.file.originalname;
        }

        // Save the updated product
        await product.save();

        const response = {
            status: 200,
            product: product,
            message: 'Product updated successfully!',
        };

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for getting all products
app.get('/api/get-products', async (req, res) => {
    try {
        const products = await Product.find();

        if (products === []) {
            return res.status(400).send("No Product Found");
        }

        const response = {
            'status': 200,
            'products': products,
            'message': 'Data retrieved successfully!',
        }

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;