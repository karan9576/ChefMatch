var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require('../models/user');
const Cook = require('../models/cook');
const Booking = require('../models/booking');
var jwt = require('jsonwebtoken');
var {jwtAuthMiddleware,generateToken}=require('../jwt.js');


router.post("/:id",jwtAuthMiddleware,async (req,res)=>{
    const cookId=req.params.id;
    const token = req.cookies.token;

    const decoded = jwt.verify(token, 'secretcode' );
    const userEmail=decoded.email;
    
    console.log(cookId)
    console.log(userEmail);
    let newBooking = {}; // Assuming newBooking is an empty object or already defined
    newBooking.totalPrice = 1000;
    newBooking.address='nhibtaunga';
    let cook =await Cook.findById(cookId);
    let user=await User.find({email:userEmail});
    console.log(user[0]._id);
    
    newBooking.user=user[0]._id
    console.log(cook._id);
    newBooking.cook=cook._id
    let booking1 =new Booking(newBooking);
    booking1.save();
res.send("booked");
});

module.exports = router;