

console.log("Entered route.js")
module.exports = function(app, passport) {

    //console.log(app);
    //console.log('-----------------------------------------Passport-----------------------------------', passport);
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, './app', 'index.html'));
    });



    app.post('/verifyuser', function (req, res, next) {
        console.log("Entered verifyusertest");
        passport.authenticate('local-login', function (err, user, info) {
            console.log("verifyusertest User", user);
            if (err) {
                return next(err)
            }
            if (!user) {
                console.log("No User");
                return res.json({err: info})
            }
            res.json(user);
        })(req, res, next);
    });


    app.post('/registeruser', function (req, res, next) {
        console.log("Entered registeruser");
        passport.authenticate('local-signup', function (err, user, info) {
            console.log("registeruser User", user);
            if (err) {
                return next(err)
            }
            if (!user) {
                console.log("Registration Failed");
                console.log(info);
                return res.json({err: info})
            }
            res.json(user);
        })(req, res, next);
    });


};