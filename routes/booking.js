var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require('../models/user');
const Cook = require('../models/cook');
var jwt = require('jsonwebtoken');
var {jwtAuthMiddleware,generateToken}=require('../jwt.js');


router.post("/:id",jwtAuthMiddleware,(req,res)=>{
    const cookId=req.params.id;
    const token = req.cookies.token;

    const decoded = jwt.verify(token, 'secretcode' );
    const user=decoded;
    
    console.log(cookId)
    console.log(user);
res.send("booked");
});

module.exports = router;