const express = require("express");
const router = express.Router();
const generateUniqueId = require('generate-unique-id');

// module for uploading product image 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, path.join(__dirname, '../uploads/product_img/')) },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const fileExtension = file.originalname.split('.').pop();
        const newFilename = file.fieldname + '_' + timestamp + '.' + fileExtension;
        cb(null, newFilename);
    },
});

const upload = multer({ storage });
const User = require("../models/user");
const Product = require("../models/product");

// API for get the total products count
router.get("/api/get-product-count", async (req, res) => {
    try {
        const totalProductCount = await Product.countDocuments();
        res.status(200).json({ totalProductCount });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for Add New Products
router.post("/api/add-products", upload.single('image'), async (req, res) => {
    try {
        const { name, category, description, price, createdBy } = req.body;

        const admin = await User.find({ _id: createdBy });

        if (admin[0].role === "Admin") {
            const id = generateUniqueId();
            if (req.file === undefined) {
                res.status(400).send("Image is required");
            }
            const image = req.file.filename;

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
router.post("/api/update-product/:id", upload.single('image'), async (req, res) => {
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
            product.image = req.file.filename;
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
router.delete('/api/delete-product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the associated image file
        const filePath = path.join(__dirname, `../uploads/product_img/${deleteProduct.image}`);
        try {
            fs.unlinkSync(filePath);
            console.log(`File deleted: ${filePath}`);
        } catch (err) {
            console.error(`Error deleting file: ${filePath}`);
            console.error(err);
        }

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// API for getting all products of a Admin
router.get('/api/get-products/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const admin = await User.find({ _id: userId });

        if (admin[0].role === "Admin") {
            const products = await Product.find();

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
        res.status(500).send('An error occurred while fetching the data');
    }
});

// API for getting all products
router.get('/api/get-products', async (req, res) => {
    try {
        const products = await Product.find();

        if (!products) {
            res.status(404).send('No Product Found');
        }

        res.status(200).json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching the data');
    }
});

module.exports = router;