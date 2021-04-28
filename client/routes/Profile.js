var express = require('express');
var router = express.Router();


router.get('/Profile', function(req, res, next) {
  res.render('profile');
});

module.exports = router;
