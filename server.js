var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//require('dotenv').config();
let passport = require('passport');

require('./raidalertbackend/models/User');
require('./raidalertbackend/models/Raid');
require('./raidalertbackend/models/Player');
require('./raidalertbackend/config/passport');

mongoose.connect(process.env.RAID_DB, {  useMongoClient: true });

var index = require('./raidalertbackend/routes/index');
var users = require('./raidalertbackend/routes/users');

var app = express();


app.use(express.static(__dirname + '/dist'));
app.listen(process.env.PORT || 4200);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);
app.all("*", (req, res) => {
  res.status(200).sendFile(`${path.join(__dirname, 'dist')}/index.html`);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
