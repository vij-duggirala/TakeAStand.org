var mongoose = require('mongoose')



const ikesSchema = new mongoose.Schema({
    postId: { type: String, required: true, unique: false },
    user: { type: String, required: true, unique: false },
    like: { type: Boolean, default: true, unique: false }
})



module.exports = mongoose.model('ikes', ikesSchema);