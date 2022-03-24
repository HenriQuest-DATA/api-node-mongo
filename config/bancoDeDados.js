const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.connectionString);

module.exports = mongoose;