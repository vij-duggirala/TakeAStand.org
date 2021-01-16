const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
const { check, validationResult } = require('express-validator');
app.set('view engine', 'ejs')
const fetch = require('node-fetch');
var protestRoutes = require('./routes/protest')
var loginRoutes = require('./routes/login_stuff')



mongoose.connect('mongodb://localhost/dange', {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})


const User = require('./models/users.js');
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();

});





app.get('/', (req, res) => {
    res.render('landing')
})

app.use('/protest', protestRoutes);
app.use('/', loginRoutes)

app.listen(process.env.PORT || 4000, function () {
    console.log('Server listening on port 4000');
});