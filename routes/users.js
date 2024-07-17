var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require('../models/user');
const Cook = require('../models/cook');
const Booking = require('../models/booking');
var jwt = require('jsonwebtoken');
var {jwtAuthMiddleware,generateToken}=require('../jwt.js');
const nodeMailer = require('nodemailer');
const mail=require("../Nodemailer.js")
router.get("/order",(req,res)=>{
  res.render("order.ejs");
})

router.use(async(req,res,next)=>{
  if(res.cookie.token){
  let token1 = req.cookies.token;
  const decoded1 = jwt.verify(token1, 'secretcode' );

  const userEmail1 = decoded1.email;

  const user1 = await User.findOne({email:userEmail1});
  
  res.locals.currUser=user1;
  console.log(res.locals.currUser);
  }
  else{
    res.locals.currUser=null;
  }
  next();
})



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

     res.redirect('/users/login');

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
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find the user by email
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
       res.redirect('/users/listings');
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


router.get('/listings',jwtAuthMiddleware,async function (req, res, next) {
  const allCooks=await Cook.find({});
  res.render("cookList.ejs",{allCooks});
})

router.get('/listings/:id',jwtAuthMiddleware,async function(req,res){
  let id=req.params.id;
  let cooker=await Cook.findById(id);
  
  res.render("book.ejs",{cooker})
});

router.post("/bookings/:id",jwtAuthMiddleware,async (req,res)=>{
  const cookId=req.params.id;
  const token = req.cookies.token;

  const decoded = jwt.verify(token, 'secretcode' );
  const userEmail=decoded.email;
  
  console.log(cookId)
  console.log(userEmail);
  let newBooking = {}; // Assuming newBooking is an empty object or already defined;
  newBooking=req.body;
  let cook =await Cook.findById(cookId);
  let user=await User.find({email:userEmail});
  console.log(user[0]._id);
  newBooking.price=cook.price;
  newBooking.user=user[0]._id
  console.log(cook._id);
  newBooking.cook=cook._id
  let booking1 =new Booking(newBooking);
  booking1.save();
  console.log(userEmail);
  console.log(cook.email);
  
  mail(userEmail, 
    `Dear ${user[0].name},
    
    Congratulations on booking your order with ChefMatch! We're thrilled to have you on board. Your chosen cook will be in touch with you shortly to confirm the details.
    
    Thank you for choosing ChefMatch, and we hope you have a delightful culinary experience!`);
    
    mail(cook.email, 
      `Dear ${cook.name},
      
      You have a new order from ${user[0].name}! Please check your dashboard for the details and reach out to the user to confirm the booking.
      
      Thank you for being a part of ChefMatch, and we look forward to your excellent service.`);


  res.redirect('/users/listings');
});


//to show the booked cooks of the particular user
router.get("/bookings",jwtAuthMiddleware,async (req,res)=>{
  //we require the email of the user to find user and his id
  let token = req.cookies.token;
  const decoded = jwt.verify(token, 'secretcode' );
  console.log(decoded)
  const userEmail = decoded.email;
  console.log(userEmail)
  const user = await User.findOne({email:userEmail});
  console.log(user)
  const bookings=await Booking.find({user:user._id}).populate('cook');;



  res.render("order.ejs",{bookings});

});
  router.get("/logout",jwtAuthMiddleware,async(req,res)=>{
    res.clearCookie("token");
    res.redirect("/")  
  })





module.exports = router;
