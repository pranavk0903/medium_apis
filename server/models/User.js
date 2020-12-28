const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "cannot be empty"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "cannot be empty"],
        unique: true
        // validate(value) {
        //     if(!validator.isEmail(value)) {
        //         throw new Error('Invalid EmailId')
        //     }
        // }
    },
    phone: {
        type: String
    },
    password : {
        type: String,
        required: true
    },
    confirmpassword : {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// generating tokens using jwt
userSchema.methods.generateAuthToken = async function() {
    try {
            const token = await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
            this.tokens = this.tokens.concat({token: token});
            await this.save();
            return token;
    } catch (error) {
        res.send('error part' + error);
    }
}

// converting password into hash using bcrypt
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
});

// add follower functionality
userSchema.methods.follow = function(id, follow) {
    if(follow === 'following' && this.following.indexOf(id) === -1) {
        this.following.push(id)
    } 
    else if(follow === 'follower' && this.followers.indexOf(id) === -1) {
        this.followers.push(id)
    }
    return this.save();
}

userSchema.methods.unfollow = function(id, follow) {
    this.followers.push(fs)        
}


const UserRegister = new mongoose.model('UserRegister', userSchema);

module.exports = UserRegister;