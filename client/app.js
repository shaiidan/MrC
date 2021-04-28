var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/Login');
var registerRouter = require('./routes/Register');
var patientHome = require('./routes/PatientHome');
var profile = require('./routes/Profile');
var serviceProvidertHome = require('./routes/ServiceProviderHome');
var uplodEMR = require('./routes/UploadEMR')
var showPatientMrC = require("./routes/ShowPatientMrC");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(loginRouter);
app.use(registerRouter);
app.use(patientHome);
app.use(profile);
app.use(serviceProvidertHome);
app.use(uplodEMR);
app.use(showPatientMrC);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
