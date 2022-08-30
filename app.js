var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require ('express-session'); //မှတ် ထာ ဖို့ login 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiIndexRouter = require('./api/routes/index'); ///connect for api route
var apiUserRouter = require('./api/routes/user'); //connect for api route

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//mongodb setup & connected
mongoose.connect("mongodb+srv://bhonethit:btamyanmar1234@blogger002.ehpjnss.mongodb.net/?retryWrites=true&w=majority");
var db = mongoose.connection;
db.on("error", console.error.bind("MongoDB connection error at blogger002"));


// mongoose.connect("mongodb://127.0.0.1/blogger002db");
// var db = mongoose.connection;
// db.on("error", console.error.bind("MongoDB connection error at blogger002"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//start use session
app.use(
  session({
    secret : "All@is@Wel#$$3&^873", //အရေးကြီး
    resave : false, //အရေးကြီး
    saveUninitialized : true,
  })
);


//creaed card
app.use(function (req, res, next){
  res.locals.user = req.session.user;
  res.locals.active = req.path;
  next();
});

//end session

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',apiIndexRouter); //for api route
app.use('/api/users',apiUserRouter); //for api route

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
