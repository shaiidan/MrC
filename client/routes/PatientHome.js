var express = require('express');
var router = express.Router();


router.get('/patientHome', function(req, res, next) {
  res.render('patientHome',{name:"shai"});
});

module.exports = router;
