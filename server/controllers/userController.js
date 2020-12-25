const UserRegister = require('../models/User');
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');


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

            const createdUser = await createUser.save();
            res.status(201).send(createdUser)
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
            

            if(isMatch) {
                res.status(200).send('Login success')
            } else {
                res.send('Invalid password credenials')
            }

    } catch (error) {
        res.status(400).send("Invalid credenials");
    }
})



module.exports = router;