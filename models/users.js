var mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');



const UserSchema = new mongoose.Schema({

    name: {
        required: true,
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { type: String, required: true, index: true, unique: true, sparse: true },
    password: {
        type: String,
    },
    Registered: { type: [String] },
    Likes: { type: [String] },
    Dislikes: { type: [String] }

})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('userData', UserSchema, 'userData');