var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require('../models/user');
const Cook = require('../models/cook');
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/signup', function (req, res, next) {
  res.render("signup.ejs");
});


router.post("/signup", async function (req, res) {//check later

  console.log(req.body.name);
  try {
    const data = req.body


    // Check if a user with the same email id already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the emailid already exists' });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        // Store hash in your password DB.
        data.password = hash;
        console.log(data);
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');
      });
    });
    console.log(data.password)
    // Create a new User document using the Mongoose model


    // Save the new user to the database



    // res.redirect('/user/login');

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//login route
router.get('/login', function (req, res, next) {
  res.render("login.ejs");
});


router.post('/login', async function (req, res, next) {
  try {
    // Extract aadharCardNumber and password from request body
    const { email, password } = req.body;

    // Check if aadharCardNumber or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find the user by aadharCardNumber
    const user = await User.findOne({ email: email });
    console.log(user);
    // If user does not exist or password does not match, return error
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }
    bcrypt.compare(password, user.password, (err, result) => {

      if (result) {
        const payload = {
          id: user.id,
        }
        let token = jwt.sign({ email: user.email }, 'secretcode');
        res.cookie("token", token);
        res.status(200).json({ message: "login success" });
      }
      else {
        res.status(401).json({ error: 'Not authorized' });
      }
    })





    // return token as response..
   

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/cook',async function (req, res, next) {
  const allCooks=await Cook.find({});
  res.render("book.ejs",{allCooks});
})

router.get('/cook/:id',async function(req,res){
  let id=req.params;
  //const cook=await Cook.findById(id);
  res.send(id);
 // res.render("show.ejs",{cook})
});




module.exports = router;
