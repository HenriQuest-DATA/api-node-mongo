'use strict'

const express = require('express');
const app = express();

//const Product = require('./models/products');

app.use(express.urlencoded());
app.use(express.json({
    limit: '5mb'
}))

consign()
    .include('./src/controllers')
    .into(app);

module.exports = app;