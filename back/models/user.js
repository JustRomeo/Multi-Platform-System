const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    tokenList: [{service: String, token: String, refreshToken: String, email: String}]
})

module.exports = mongoose.model('user', userSchema)