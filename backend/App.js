require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require("cors");
const { adminMiddleware, userMiddleware } = require("./middleware/Auth");
const generateUniqueId = require('generate-unique-id');

// module for uploading product image 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const timestamp = Date.now();

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(file.originalname,
            file.mimetype.split('/')[0] + '_' + timestamp + '.' + file.mimetype.split('/')[1]))
    },
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve("./uploads")));

const email = require('./Email');
const payment = require('./Payment');
app.use('/', email);
app.use('/', payment);

const User = require("./models/user");
const Product = require("./models/product");

// app.get("/admin/welcome", adminMiddleware, (req, res) => {
//     res.status(200).send("Welcome 🙌 ");
// });

// API for get the total users count
app.get("/api/get-user-count", async (req, res) => {
    try {
        const totalUserCount = await User.countDocuments();
        res.status(200).json({ totalUserCount });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for get the total products count
app.get("/api/get-product-count", async (req, res) => {
    try {
        const totalProductCount = await Product.countDocuments();
        res.status(200).json({ totalProductCount });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
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

// API for getting all customer details only for an Admin
app.get('/api/get-users/:id', async (req, res) => {
    try {

        const userId = req.params.id;

        const admin = await User.find({ _id: userId });

        if (admin[0].purpose === "Sell") {

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
app.get('/api/get-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.find({ _id: userId });

        if (!user) {
            res.status(404).send('User Not Found');
        }

        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for deleting a user by ID
app.delete('/api/delete-user/:id', async (req, res) => {
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

// API for Add New Products
app.post("/api/add-products", upload.single('image'), async (req, res) => {
    try {
        const { name, category, description, price, createdBy } = req.body;

        const admin = await User.find({ _id: createdBy });

        if (admin[0].purpose === "Sell") {
            const id = generateUniqueId();
            if (req.file === undefined) {
                res.status(400).send("Image is required");
            }
            const image = req.file.mimetype.split('/')[0] + '_' + timestamp + '.' + req.file.mimetype.split('/')[1];

            // Validate product information input
            if (!(name && category && description && price && image)) {
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
                id, name, category, description, price, image, createdBy
            });

            const response = {
                'status': 200,
                'product': newProduct,
                'message': 'New Product Added successfully!',
            }

            res.send(response);
        } else {
            res.status(401).send('Unauthorised User');
        }
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
        if (req.body.category) {
            product.category = req.body.category;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }
        if (req.file) {
            product.image = req.file.mimetype.split('/')[0] + '_' + timestamp + '.' + req.file.mimetype.split('/')[1];
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

// API for getting all products of a Admin
app.get('/api/get-products/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const admin = await User.find({ _id: userId });

        if (admin[0].purpose === "Sell") {
            const products = await Product.find({ createdBy: userId });

            if (!products) {
                res.status(404).send('No Product Found');
            }

            res.status(200).json({ 'products': products, });
        }
        else {
            res.status(401).send('Unauthorised User');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for getting all products
app.get('/api/get-products', async (req, res) => {
    try {
        const products = await Product.find();

        if (!products) {
            res.status(404).send('No Product Found');
        }

        res.status(200).json({ products, });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;