var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const Cook = require('../models/cook');
var jwt = require('jsonwebtoken');
const Booking = require('../models/booking');
var {jwtAuthMiddleware,generateToken}=require('../jwt.js');


router.use(async(req,res,next)=>{
console.log(req)
  if(req.cookies.token){
  let token1 = req.cookies.token;
  console.log(token1);
  const decoded1 = jwt.verify(token1, 'secretcode' );

  const cookEmail1 = decoded1.email;

  const cook1 = await Cook.findOne({email:cookEmail1});
  
  res.locals.currCook=cook1;
  console.log(res.locals);
  console.log("hi");
  }
  else{
    res.locals.currCook=null;
    console.log(res.locals.currCook);
  }
  next();
})



/* GET cook listing. */
router.get('/signup', function (req, res, next) {
  res.render("cooksignup.ejs");
});


router.post("/signup", async function (req, res) {//check later

  console.log(req.body.name);
  try {
    const data = req.body


    // Check if a cook with the same email id already exists
    const existingCook = await Cook.findOne({ email: data.email });
    if (existingCook) {
      return res.status(400).json({ error: 'cook with the same emailid already exists' });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        // Store hash in your password DB.
        data.password = hash;
        console.log(data);
        const newCook = new Cook(data);
        const response = await newCook.save();
        console.log('data saved');
      });
    });
    console.log(data.password)
    // Create a new Cook document using the Mongoose model


    // Save the new Cook to the database



     res.redirect('/cook/login');

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//login route
router.get('/login', function (req, res, next) {
  res.render("cooklogin.ejs");
});


router.post('/login', async function (req, res, next) {
  try {
    // Extract aadharCardNumber and password from request body
    const { email, password } = req.body;

    // Check if aadharCardNumber or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find the cook by aadharCardNumber
    const cook = await Cook.findOne({ email: email });
    console.log(cook);
    // If cook does not exist or password does not match, return error
    if (!cook) {
      return res.status(401).json({ error: 'cook not found' });
    }
    bcrypt.compare(password, cook.password, (err, result) => {

      if (result) {
        const payload = {
          id: cook.id,
        }
        let token = jwt.sign({ email: cook.email }, 'secretcode');
        res.cookie("token", token);
        res.redirect('/cook/bookings')
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

router.get("/bookings",jwtAuthMiddleware,async (req,res)=>{
  let token=req.cookies.token;
  const decoded = jwt.verify(token, 'secretcode' );
  const cookEmail=decoded.email;
  const cook=await Cook.findOne({email:cookEmail});
  const bookings=await Booking.find({cook:cook._id}).populate('user');;
  res.render("cookorder.ejs",{bookings});
});
router.put("/bookings/:id",jwtAuthMiddleware,async (req,res)=>{

  const bookings=await Booking.findByIdAndUpdate(req.params.id,req.body);
  res.redirect('/cook/bookings');
});
router.get("/logout",jwtAuthMiddleware,async(req,res)=>{
    res.clearCookie("token");
    res.redirect("/")  ;
  })




module.exports = router;
