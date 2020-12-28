const UserRegister = require('../models/User');
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const userProfile = require('../models/userProfile');

// user registration API => POST
router.post('/userRegister', async(req, res) => {
    try {

          const password = req.body.password;
          const cpassword = req.body.confirmpassword;

          if(password === cpassword) {
                const createUser = new UserRegister({
                    name : req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password :  password,
                    confirmpassword : cpassword
                })

            const token = await createUser.generateAuthToken();

            // Adding cookies
            res.cookie('jwt', token, {
                expires:new Date(Date.now() + 60000),
                httpOnly: true
            });
            // console.log(cookie)

            const createdUser = await createUser.save();
            res.status(201).send([createdUser,"User created successfully"])
          }else {
              res.send('password not match')
          }


    } catch (error) {
        res.status(400).send(error);
    }   
});

// user signin API =>

router.post('/userLogin', async(req, res) => {
    try {
            const email = req.body.email;
            const password = req.body.password;

            const useremail = await UserRegister.findOne({email:email});

            const isMatch = await bcrypt.compare(password, useremail.password );
            console.log(isMatch);

            const token = await useremail.generateAuthToken();
            
              // Adding cookies
              res.cookie('jwt', token, {
                expires:new Date(Date.now() + 60000),
                httpOnly: true
            });

            if(isMatch) {
                res.status(200).send(`Login success for user ${email}`);
            } else {
                res.send('Invalid password credenials')
            }

    } catch (error) {
        res.status(400).send("Invalid credenials");
    }
})

// Visit UserProfile => GET

router.get('/userProfile', auth, (req, res) => {
        res.send('do nothing');
});


//  User logout API => GET
router.get('/userLogout', auth, async(req, res) => {
        try {
                console.log(req.user);

                req.user.tokens = req.user.tokens.filter((currentToken) => {
                    return currentToken.token != req.token 
                })
                res.clearCookie('jwt');
                res.send('Logout Successful');

                await req.user.save();
        } catch (error) {
            res.status(500).send('error')
        }

});

// create user Profile API => POST

router.post('/createProfile',  async(req, res) => {
    try {
         
        const useremail = await UserRegister.find({email:req.body.email}).countDocuments() > 0;
        const userData= await UserRegister.find(
            {tokens:{ $elemMatch:{token: req.headers.token}}},{email: 1, name: 1})

                console.log(userData);

        if(userData.length > 0) {
            const createProfile = new userProfile({
                name : userData[0].name,
                email: userData[0].email,
                bio: req.body.bio
            })
            const createdProfile = await createProfile.save();
            res.status(201).send('User Profile created successfully');
        } else {
            res.send('User not exist');
        }
        
    } catch (error) {
        res.status(501).send(error)
    }
})


module.exports = router;