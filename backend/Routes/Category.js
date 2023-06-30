const express = require("express");
const router = express.Router();
const generateUniqueId = require('generate-unique-id');

// module for uploading category image 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, path.join(__dirname, '../uploads/category_img/')) },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const fileExtension = file.originalname.split('.').pop();
        const newFilename = file.fieldname + '_' + timestamp + '.' + fileExtension;
        cb(null, newFilename);
    },
});

const upload = multer({ storage });
const User = require("../models/user");
const Category = require("../models/category");

// API for get the total category count
router.get("/api/get-category-count", async (req, res) => {
    try {
        const totalCategoryCount = await Category.countDocuments();
        res.status(200).json({ totalCategoryCount });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for Add New Category
router.post("/api/add-category", upload.single('image'), async (req, res) => {
    try {
        const { name, createdBy } = req.body;

        const admin = await User.find({ _id: createdBy });

        if (admin[0].role === "Admin") {
            const id = generateUniqueId();
            if (req.file === undefined) {
                res.status(400).send("Image is required");
            }
            const image = req.file.filename;

            // Validate category information input
            if (!(name && image)) {
                res.status(400).send("All input is required");
                return; // Return early to prevent further execution
            }

            // Check if the category with the same name already exists
            const existingCategory = await Category.findOne({ name });

            if (existingCategory) {
                res.status(400).send("Category with the same name already exists");
                return; // Return early to prevent further execution
            }

            // add new category in the database
            const newCategory = await Category.create({
                id, name, image, createdBy
            });

            const response = {
                'status': 200,
                'category': newCategory,
                'message': 'New Category Added successfully!',
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

// API for Update Category by ID
router.post("/api/update-category/:id", upload.single('image'), async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Retrieve the existing category from the database
        const category = await Category.findById(categoryId);

        // Check if the category exists
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Update the category fields with the new values (if provided)
        if (req.body.name) {
            category.name = req.body.name;
        }
        if (req.file) {
            category.image = req.file.filename;
        }

        // Save the updated category
        await category.save();

        const response = {
            status: 200,
            category: category,
            message: 'Category updated successfully!',
        };

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

// API for deleting a Category by ID
router.delete('/api/delete-category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deleteCategory = await Category.findByIdAndDelete(categoryId);

        if (!deleteCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete the associated image file
        const filePath = path.join(__dirname, `../uploads/category_img/${deleteCategory.image}`);
        try {
            fs.unlinkSync(filePath);
            console.log(`File deleted: ${filePath}`);
        } catch (err) {
            console.error(`Error deleting file: ${filePath}`);
            console.error(err);
        }

        res.status(200).json({ message: 'Category deleted successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// API for getting all category of a Admin
router.get('/api/get-category/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const admin = await User.find({ _id: userId });

        if (admin[0].role === "Admin") {
            const category = await Category.find();

            if (!category) {
                res.status(404).send('No Category Found');
            }

            res.status(200).json({ 'category': category, });
        }
        else {
            res.status(401).send('Unauthorised User');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching the data');
    }
});

// API for getting all category
router.get('/api/get-category', async (req, res) => {
    try {
        const category = await Category.find();

        if (!category) {
            res.status(404).send('No Category Found');
        }

        res.status(200).json({ category });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while fetching the data');
    }
});

module.exports = router;