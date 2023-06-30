// Run this file for data Seeding by this command:- "node Seeder.js"

const { MongoClient } = require('mongodb');
const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'e-commerce';

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(DB_URL, {
            useUnifiedTopology: true,
        });
        return client.db(DB_NAME);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

// write the user data for seeding
const usersData = [
    {
        name: "Admin",
        email: "admin@gmail.com",
        phoneNumber: "9080706050",
        password: "$2b$10$siI43p7y63fVG5XRepCUxOBjhiLVcRcF5/PjgRDEa3BLafjxBfFAq",
        role: "Admin"
    },
    {
        name: "Customer",
        email: "customer@gmail.com",
        phoneNumber: "9876543210",
        password: "$2b$10$zIJGNSb5rCrzkZ.jRg7E6u79j1V2ccirhp.R8.DRvXpP98o0yvL8i",
        role: "Customer"
    }
];

// make a function for inserting the seeding data
async function seedData() {
    const db = await connectToDatabase();

    try {
        // Insert data into the 'users' collection
        await db.collection('users').insertMany(usersData);

        console.log('Data seeding complete!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// Run the seeding script
seedData();  