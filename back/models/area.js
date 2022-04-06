const mongoose = require('mongoose')

const areaSchema = mongoose.Schema({
    id: mongoose.ObjectId,

    userID: {type: String, required: true},
    data: {type: String},

    Action: {type: String, required: true},
    ActionParameter: [{type: String}],

    Reaction: {type: String, required: true},
    ReactionParameter: [{type: String}]
})

module.exports = mongoose.model('area', areaSchema)