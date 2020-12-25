const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
})


const UserRegister = new mongoose.model('UserRegister', userSchema);

module.exports = UserRegister;