const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    bio: {
        type: String,
        require: true
    }
});

const userProfile = new mongoose.model('UserProfile', userProfileSchema);

module.exports = userProfile;
