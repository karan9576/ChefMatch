var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require('../models/user');
const Cook = require('../models/cook');
var jwt = require('jsonwebtoken');


router.post("/",(req,res)=>{
res.send("booked")
});

module.exports = router;