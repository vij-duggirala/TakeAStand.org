var express = require('express')
var router = express.Router()

const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

var User = require('../models/users.js');

module.exports = router

router.get('/', (req, res) => {
    if (req.user)
        res.redirect('/protest');
    else
        res.render('landing')
})

router.get("/register", function (req, res) {
    if (req.user) {
        return res.redirect("/protest");
    } else {
        res.render("register");
    }
});


router.post('/register', (req, res) => {
    var newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
            req.flash("error", "error , please try again");
        }
        passport.authenticate("local")(req, res, function () {

            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/protest");
        });
    });
})

router.get('/login', (req, res) => {
    if (req.user)
        res.redirect('/protest');
    else
        res.render('login')
})


router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/protest",
        failureRedirect: "/login"
    }), function (req, res) {
        res.redirect('/ji')
    });

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
});
