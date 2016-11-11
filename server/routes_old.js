

console.log("Entered route.js");
module.exports = function(app, passport) {

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
                return res.status(500).json({err: info})
            }
            res.status(200).json(user);
        })(req, res, next);
    });


    app.post('/verifyuser', function(req, res, next) {
        console.log("Entered verifyuser");
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: info
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });




    app.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

};



