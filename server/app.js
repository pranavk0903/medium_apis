require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const db = require('./models/conn');
const userController = require('./controllers/userController');
const blogController = require('./controllers/blogController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/medium', userController);
app.use('/medium', blogController);

app.use('/medium/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Listening');
});