require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var Cookies = require('cookies')
var Keygrip = require("keygrip")
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost/teloscope", { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

var indexRouter = require('./routes/index');
var devRouter = require('./routes/dev');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let keys = Keygrip(["SEKRIT2", "SEKRIT1"], 'sha256', 'hex')
app.use(Cookies.express(keys))
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/dev', devRouter);

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
