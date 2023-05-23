require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve("./uploads")));

const user = require('./Routes/User');
const product = require('./Routes/Product');
const order = require('./Routes/Order');
const payment = require('./Routes/Payment');
const email = require('./Routes/Email');
app.use('/', user);
app.use('/', product);
app.use('/', order);
app.use('/', payment);
app.use('/', email);

module.exports = app;