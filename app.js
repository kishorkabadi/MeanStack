const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv/config');
const morgan = require('morgan')// used to logged http request
const mongoose = require('mongoose')

const prouductRouter = require('./routers/products');

const categoryRouter = require('./routers/categories');

const userRouter = require('./routers/users');
const authJwt = require('./Helpers/jwt');
const errorHandler=require('./Helpers/error-handler')
const api_URL = process.env.Api_URL;

//middleware

//Enable cors
app.use(cors());
app.options('*', cors());

//app.use(express.json());//its deprected, instead use below, for that need to import /require 'const bodyParser=require('body-parser');'
app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use(authJwt());

app.use(errorHandler);

//Routers
app.use(`${api_URL}/products`, prouductRouter);
app.use(`${api_URL}/categories`, categoryRouter);
app.use(`${api_URL}/users`, userRouter);

mongoose.connect(process.env.ConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
    .then(() => {
        console.log('DB Connection is ready');
    }).catch((err) => {
        console.log(err);

    });

app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
    console.log(api_URL);
});

