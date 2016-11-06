var express = require('express');
var path = require('path');
var app = express();
var passport = require('passport');
app.use(passport.initialize());
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');

var route = require('./route');
var Model = require('./model');







app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates', 'index.html'));
});




// process the login form
/*
app.post('/verifyusertest', passport.authenticate('local-login', { successRedirect: '/Home',
        failureRedirect: '/login' }),
    function(req, res) {
        console.log("hello");
        console.log(res);
        res.redirect('/');
    });
*/
app.get('/verifyusertest', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
});




// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

//var bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    connection.query("SELECT * FROM users WHERE email = ? ", [email], function (err, rows) {
        done(err, rows[0]);
});


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use(
    'local-signup',
    new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log(req);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
);

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use(
    'local-login',
    new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'pass',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req,username,password, done) { // callback with email and password from our form
            console.log(username);
                        connection.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows){
                            console.log(err,rows[0]);
                if (err)
                    return done(err);
                            if (!rows.length) {
                                console.log('No user found');
                                return done(null, false, { message: 'No User Found' }); // req.flash is the way to set flashdata using connect-flash
                            }



                // if the user is found but the password is wrong
 //               if (!bcrypt.compareSync(password, rows[0].password))
 //                   return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                if ((password != rows[0].pass)) {
                    console.log('Oops! Wrong password.');
                    return done(null, false, ('Oops! Wrong password.'));
                }
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
);









app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/ajax', express.static(__dirname + '/ajax'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/templates', express.static(__dirname + '/templates'));
app.use('/includes', express.static(__dirname + '/includes'));
app.use('/app', express.static(__dirname + '/app'));
app.use('/fonts', express.static(__dirname + '/fonts'));


module.exports = app;