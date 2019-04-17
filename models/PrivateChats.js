var mongoose = require('mongoose');
var PrivateChatSchema = mongoose.Schema({
    sender: String,
    reciever: String,
    text: String,
    time: {type:Date, default:Date}
})
module.exports = mongoose.model('PrivateMessage', PrivateChatSchema);