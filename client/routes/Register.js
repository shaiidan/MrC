'use strict';

var express = require('express');
var router = express.Router();

router.get('/Register', function(req, res, next) {
  res.render('register');
});

module.exports = router;
