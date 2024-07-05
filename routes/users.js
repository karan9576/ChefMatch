var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User=require('../models/user');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render("signup.ejs");
});


router.post("/signup",async function(req,res){//check later

    console.log(req.body.name);
    try{
        const data = req.body 
        

        // Check if a user with the same email id already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
              // Store hash in your password DB.
              data.password = hash;
              console.log(data);
          });
      });

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');


        res.redirect('/user/login');

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//login route
router.get('/login', function(req, res, next) {
  res.render("login.ejs");
});


router.post('/login', async function(req, res, next) {
  try{
    // Extract aadharCardNumber and password from request body
    const {email, password} = req.body;

    // Check if aadharCardNumber or password is missing
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    // Find the user by aadharCardNumber
    const user = await User.findOne({email: email});

    // If user does not exist or password does not match, return error
    if( !user || !(await user.comparePassword(password))){
        return res.status(401).json({error: 'email or Password'});
    }

    // generate Token //
    const payload = {
        id: user.id,
    }
    const token = generateToken(payload);
    console.log("succesful login");

    res.cookie('token', token);

    // return token as response..
    res.redirect('/');
    // res.json({token})
}catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error'});
}
});





module.exports = router;
