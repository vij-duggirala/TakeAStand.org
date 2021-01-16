var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');

const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

var User = require('../models/users.js');
var Posts = require('../models/posts.js');
var Comments = require('../models/comments.js');
var Filter = require('bad-words'),
    filter = new Filter();

var multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var ikes = require('../models/ikes.js');
var registers = require('../models/register.js')
const fetch = require('node-fetch');



module.exports = router

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new_post');
})



router.post('/new', async (req, res) => {

    var string = req.body.location;
    const api_url = "http://api.positionstack.com/v1/forward?access_key=728600e7340ec73ca78eb07fb4a65150&query=" + `'` + string + `'` + "&limit=5";
    const fetch_response = await fetch(api_url);
    const Json = await fetch_response.json();
    console.log(Json)
    var lat = 0;
    var lon = 0;



    lat = Json.data[0].latitude
    lon = Json.data[0].longitude

    var newPost = new Posts({
        name: req.body.name,
        author: req.user.username,
        createdAt: Date.now(),
        organization: req.body.organization,
        date: req.body.date,
        latitude: lat,
        longitude: lon,
        location: req.body.location,
        description: req.body.description,
        keywords: req.body.keywords

    });
    await newPost.save();
    res.redirect('/protest');

})

router.post('/:id/act/:action', isLoggedIn, (req, res, next) => {

    var action = req.params.action;

    const counter = 1
    var like = true
    if (action == "Like")
        Posts.updateOne({ _id: req.params.id }, { $inc: { numLiked: counter } }, {}, (err, numberAffected) => {
            res.send('');
        });
    else {
        Posts.updateOne({ _id: req.params.id }, { $inc: { numDisliked: counter } }, {}, (err, numberAffected) => {
            res.send('');
        });
        like = false;
    }

    var newIke = new ikes({
        postId: req.params.id,
        user: req.user.username,
        like: like
    });
    newIke.save();

});


router.post('/:id/reg', isLoggedIn, (req, res) => {
    const counter = 1;
    Posts.updateOne({ _id: req.params.id }, { $inc: { numRegistered: counter } }, {}, (err, numberAffected) => {
        res.send('');
    });

    var newReg = new registers({
        postId: req.params.id,
        user: req.user.username,

    });
    newReg.save();
});




router.post('/:id/comm', isLoggedIn, async (req, res) => {

    var polarity = 0;
    let ikestf = await ikes.findOne({ postId: req.params.id, user: req.user.username });
    if (ikestf) {
        if (ikestf.like === true)
            polarity = 1;
        else
            polarity = -1;
    }

    var comment = filter.clean(req.body.comment);
    var newComm = new Comments({
        comment: comment,
        postId: req.params.id,
        author: req.user.username,
        polarity: polarity
    })
    newComm.save();

    res.redirect('/protest/' + req.params.id);

})



router.post('/:id/img', upload.single('image'), isLoggedIn, async (req, res) => {
    console.log(req.file);
    let foundPost = await Posts.findOne({ _id: req.params.id });

    foundPost.Images.push(req.file.filename)
    foundPost.save()
    res.redirect('/protest/' + req.params.id);
})



router.get('/:id', isLoggedIn, async (req, res) => {

    let posts = await Posts.findById(req.params.id);
    let comments = await Comments.find({ postId: req.params.id });

    let ikestf = await ikes.find({ postId: req.params.id, user: req.user.username });

    let registeredtf = await registers.find({ postId: req.params.id, user: req.user.username });
    let interacted = false;
    if (ikestf.length) {
        interacted = true;

    }
    let registered = false;
    if (registeredtf.length)
        registered = true;

    res.render('display', { post: posts, comments: comments, interacted: interacted, registered: registered });

});









router.get('/', isLoggedIn, (req, res) => {
    Posts.find({}).sort({ date: -1 }).exec(function (err, allPosts) {
        if (err) {
            req.flash("error", "something went wrong");
            res.redirect("/");
        }
        else {
            res.render("show", { posts: allPosts });
        }
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!")
    res.redirect("/login");
}