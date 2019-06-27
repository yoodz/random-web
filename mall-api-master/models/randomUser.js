const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    "name": String,
    "gender": String,
    "type": String,
    "number": String,
    "idCard": String,
    "certificate": String,
    'createDate': { type: Date, default: Date.now },
    'updateDate': { type: Date, default: Date.now },
    'deleted': { type: Boolean, default: false }
})
module.exports = mongoose.model('randomUser', userSchema)
