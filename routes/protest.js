var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');

const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

var User = require('../models/users.js');
var Posts = require('../models/posts.js');
var Comments = require('../models/comments.js');


module.exports = router

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new_post');
})



router.post('/new', (req, res) => {
    var newPost = new Posts({
        name: req.body.name,
        author: req.user.username,
        createdAt: Date.now(),
        organization: req.body.organization,
        date: req.body.date,
        //  time : req.body.time ,
        location: [req.body.loc1, req.body.loc2],
        description: req.body.description,
        keywords: req.body.keywords
    });
    newPost.save();
    res.redirect('/protest');
})

router.post('/:id/act/:action', isLoggedIn, (req, res, next) => {

    var action = req.params.action;

    console.log(action);
    const counter = 1
    if (action == "Like")
        Posts.updateOne({ _id: req.params.id }, { $inc: { numLiked: counter } }, {}, (err, numberAffected) => {
            res.send('');
        });
    else
        Posts.updateOne({ _id: req.params.id }, { $inc: { numDisliked: counter } }, {}, (err, numberAffected) => {
            res.send('');
        });


});


router.post('/:id/reg', isLoggedIn, (req, res) => {
    const counter = 1;
    Posts.updateOne({ _id: req.params.id }, { $inc: { numRegistered: counter } }, {}, (err, numberAffected) => {
        res.send('');
    });
});




router.post('/:id/comm', isLoggedIn, (req, res) => {
    console.log(req.params.id)
    console.log(req.user.username)

    var newComm = new Comments({
        comment: req.body.comment,
        postId: req.params.id,
        author: req.user.username
    })
    newComm.save();

    res.redirect('/protest/' + req.params.id);

})





router.get('/:id', isLoggedIn, async (req, res) => {

    let posts = await Posts.findById(req.params.id);
    let comments = await Comments.find({ postId: req.params.id });

    res.render('display', { post: posts, comments: comments });

});









router.get('/', isLoggedIn, (req, res) => {
    Posts.find({}, function (err, allPosts) {
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