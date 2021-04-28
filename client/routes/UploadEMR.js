var express = require('express');
var router = express.Router();
const uploadEMR = require("../modles/UploadingEMR");


router.get('/UploadEMR',function(req, res, next) {
  res.render('uploadEMR');
});


router.post('/UploadEMR', uploadEMR.single("EMRFile"), function(req, res){
  console.log(req.file);
  res.render('showPatientMrC',{name:"shai"});

});

module.exports = router;
