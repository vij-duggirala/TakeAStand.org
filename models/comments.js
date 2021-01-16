var mongoose = require('mongoose')



const CommentsSchema = new mongoose.Schema({

    comment: { type: String, required: true, unique: false },
    postId: { type: String, required: true, unique: false },
    author: { type: String, required: true, unique: false },
    against: { type: Boolean, default: false, unique: false }
})



module.exports = mongoose.model('comments', CommentsSchema);