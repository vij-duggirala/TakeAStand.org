var mongoose = require('mongoose')
const marked = require('marked');



const PostsSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    organization: { type: String, default: null },
    date: { type: Date, default: null },
    time: { type: Date, default: null },
    description: {
        type: String,
        required: true
    },
    location: { type: String, default: null },
    keywords: {
        type: String,
        default: null
    },
    numRegistered: {
        type: Number,
        default: 0
    },
    numLiked: {
        type: Number,
        default: 0
    },
    numDisliked: {
        type: Number,
        default: 0
    },
    sanitisedHTML: {
        type: String
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
})

PostsSchema.pre('validate', function (next) {
    if (this.description)
        this.sanitisedHTML = marked(this.description);
    next()
})

module.exports = mongoose.model('Posts', PostsSchema);