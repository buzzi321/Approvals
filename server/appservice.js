// dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// create instance of express
var app = express();


require('./passport')(passport); // pass passport for configuration


// define middleware
app.use(express.static(path.join(__dirname, '../app')));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
    secret: 'sekharsecret',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// require routes
var routes = require('./routes.js')(app, passport);
// routes
//app.use('/user/', routes);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

// error hndlers
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});


module.exports = app;