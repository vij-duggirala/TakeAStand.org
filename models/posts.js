var mongoose = require('mongoose')
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
    location: { type: [Number], default: null },
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
    }
})
module.exports = mongoose.model('Posts', PostsSchema);