const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user'); // connect the table(/objectRoute) to the database
const categoryRotue = require('./routes/category');
const productRoute = require('./routes/product');
const billRoute = require('./routes/bill');
const dashboard = require('./routes/dashboard');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//app.use('./user', userRoute);
app.use('/user', userRoute); //define the route name
app.use('/category', categoryRotue);
app.use('/product', productRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboard);

module.exports = app;