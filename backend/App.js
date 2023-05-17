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
const fs = require('fs');

let randomImageNumber;
setInterval(function () {
    randomImageNumber = Math.floor(Math.random() * 9999999);
    console.log(randomImageNumber);
}, 1500);

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cb) => { cb(null, file.originalname.replace(file.originalname, randomImageNumber + file.originalname)) },
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
                'userId': user._id,
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
        const image = req.file.originalname.replace(req.file.originalname, randomImageNumber + req.file.originalname);
        const createdBy = req.body.createdBy;

        // Validate product information input
        if (!(name && description && price && image)) {
            res.status(400).send("All input is required");
            return; // Return early to prevent further execution
        }

        // Check if the product with the same name already exists
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            res.status(400).send("Product with the same name already exists");
            return; // Return early to prevent further execution
        }

        // add new product in the database
        const newProduct = await Product.create({
            name, description, price, image, createdBy
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

// API for Update Product by ID
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
            product.image = req.file.originalname.replace(req.file.originalname, randomImageNumber + req.file.originalname);;
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

// API for deleting a product by ID
app.delete('/api/delete-product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the associated image file
        fs.unlink(`uploads/${deleteProduct.image}`, (err) => {
            if (err) {
                console.error(err);
            }
        });

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// API for getting all products
app.get('/api/get-products/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const products = await Product.find({ createdBy: userId });

        if (!products) {
            const response = {
                'status': 404,
                'message': 'No Product Found',
            };

            return res.send(response);
        }

        const response = {
            'status': 200,
            'products': products,
            // 'message': 'Data retrieved successfully!',
        }

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;