var express = require('express');
var mysql = require('mysql');
var path = require('path');
var app = express();
var passport = require('passport');
app.use(passport.initialize());
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sekhar',
    password: 'sekhar',
    database: 'mydb'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates', 'index.html'));
});


app.post('/signup', function (req, res, next) {
    var userload = req.body;
    console.log('signup request received:', userload);
    var query = connection.query('insert into users set ?', userload, function (err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            return res.send('Ok');
        }
    })
});


app.post("/verifyuser", function (req, res) {
    var userloginload = req.body;
    console.log('login request received:', userloginload);
    var email = req.body.email;
    var pass = req.body.pass;
    console.log(email, pass);
    connection.query('SELECT * from users where email = ? and pass =?', [email, pass], function (err, rows, fields) {
        if (!err) {
            console.log('Login found');
            //console.log('Role', rows[0].role);
            //console.log('Role', fields);
            return res.send('Ok');

        }
        else {
            console.log('Login user not found', rows);
            return res.send(err);
        }
    });
});


app.post('/newrequest', function (req, res, next) {
    var newrequest = req.body;
    console.log('new approval request received:', newrequest);
    var query = connection.query('insert into requests set ?', newrequest, function (err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            return res.send('Ok');
        }
    })
});


app.post('/getApprovals', function (req, res) {
    //console.log('Get approval request received:', req);
    //var approverrequest = req.body;
    var assignedemail = req.body.email;
    //console.log('Get approval request received:', approverrequest);
    connection.query('SELECT * from requests where assignedto = ?', [assignedemail], function (err, rows) {
        if (!err) {
            //console.log('Login found', rows);
            //console.log('Role', rows[0].role);
            //console.log('Role', fields);
            return res.send(rows);


        }
        else {
            console.log('Login user not found', rows);
            return res.send(err);
        }
    });
});


app.get('/getMetaData', function (req) {
    var form_id = req.form_id;

    console.log('getMetaData request received:', req);
    connection.query('SELECT * from md_fields where form_id = ?', [form_id], function (err, rows) {
        if (!err) {
            return res.send(rows);


        }
        else {
            console.log('Login user not found', rows);
            return res.send(err);
        }
    });
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

// expose this function to our app using module.exports
passport.serializeUser(function (user, done) {
    done(null, user.user_id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    connection.query("SELECT * FROM users WHERE email = ? ", [username], function (err, rows) {
        done(err, rows[0].user);
    });
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