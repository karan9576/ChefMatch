var express = require('express');
var router = express.Router();

/* GET home page.f */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
