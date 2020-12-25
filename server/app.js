require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

const db = require('./models/conn');
const router = require('./controllers/userController');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/medium', router);


// start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Listening');
});