var express = require('express');
var router = express.Router();

router.get('/ShowPatientMrC', function(req, res, next) {
  res.render('showPatientMrC',{name:"shai"});
});

module.exports = router;
