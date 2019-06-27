const mongoose = require('mongoose')
const lotterySchema = new mongoose.Schema({
    "title": String,
    "descripe": String,
    "date": String,
    "time": String,
    "selected": Array,
    "z": Object,
    'f': Object,
    'j': Object,
    't': Object,
    'finnalResult': Object,
    'showData': Object,
    'finish': { type: Boolean, default: false },
    'createDate': { type: Date, default: Date.now },
    'updateDate': { type: Date, default: Date.now },
    'deleted': { type: Boolean, default: false }
})
module.exports = mongoose.model('lottery', lotterySchema)
