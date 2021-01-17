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
    imageURL: {
        type: String,
        deafult: "https://bgp-palembang.com/assets/default-user.png"
    }
})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('userData', UserSchema, 'userData');