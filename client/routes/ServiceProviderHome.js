var express = require('express');
var router = express.Router();



router.get('/ServiceProviderHome', function(req, res, next) {
  res.render('serviceProviderHome',{name:"Shai"});
});

module.exports = router;
