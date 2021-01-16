var mongoose = require('mongoose')



const registerSchema = new mongoose.Schema({
    postId: { type: String, required: true, unique: false },
    user: { type: String, required: true, unique: false },
})



module.exports = mongoose.model('registers', registerSchema);