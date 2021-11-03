const { boolean } = require('@hapi/joi');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        min: 6
    },

    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },

    address: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false

    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema);