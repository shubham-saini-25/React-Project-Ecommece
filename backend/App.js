require("./config/database").connect();
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve("./uploads")));

const user = require('./Routes/User');
const category = require('./Routes/Category');
const product = require('./Routes/Product');
const order = require('./Routes/Order');
const payment = require('./Routes/Payment');
const email = require('./Routes/Email');

app.use('/', user);
app.use('/', category);
app.use('/', product);
app.use('/', order);
app.use('/', payment);
app.use('/', email);

module.exports = app;