const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

//Importing Routes
const authRoutes = require('./Routes/users');
const blogRoute = require('./Routes/blogs');

//connecting to database
mongoose.connect(process.env.DB_CONNECTION, () => { console.log("connected to db") });

//Middleware

app.use(express.json());

app.use(cors('*'));

// Creating a Route Middleware

app.use('/api/user', authRoutes);
app.use('/api/blogs', blogRoute);
//Listening to Server:).
app.listen(5000, () => (console.log("Listening to Port 5000")));