// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports

console.log("Entered passport.js");
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

    passport.serializeUser(function (user, done) {
        done(null, user.user_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM users WHERE email = ? ", [username], function (err, rows) {
            done(err, rows[0].user);
        });
    });


    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'pass',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, username, password, done) {
                console.log('Entered local-signup');
                console.log(req.body);

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists



                connection.query("SELECT * FROM users WHERE email = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, {message: 'User already exists'});
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            //password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                            password:password,
                            role: req.body.email,
                            lname : req.body.lName,
                            fname : req.body.fName
                        };

                        var insertQuery = "INSERT INTO users ( username, password, role, firstname, lastname ) values (?,?,?,?,?)";

                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.role, newUserMysql.fname, newUserMysql.lname], function (err, rows) {


                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );


    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'pass',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, username, password, done) { // callback with email and password from our form

                console.log('username', username);
                connection.query("SELECT * FROM users WHERE email = ?", [username], function (err, rows) {
                    console.log(err, rows[0]);
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        console.log('No user found');
                        return done(null, false, {message: 'No User Found'}); // req.flash is the way to set flashdata using connect-flash
                    }


                    // if the user is found but the password is wrong
                    //               if (!bcrypt.compareSync(password, rows[0].password))
                    //                   return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    console.log('returned password:', rows[0].pass);
                    console.log('entered password:',password);
                    if ((password != rows[0].pass)) {
                        console.log('Wrong password.');
                        return done(null, false, {message: 'Wrong Password'});
                    }
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};