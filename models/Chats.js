var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
    nickname: String,
    text: String,
    room:String,
    creationDate: {type:Date, default:Date}
})
module.exports = mongoose.model('Messages', chatSchema);