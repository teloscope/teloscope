const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {type: String},
});

module.exports = mongoose.model('TestModel', testSchema );