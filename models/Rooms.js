var mongoose = require('mongoose');
var room = new mongoose.Schema({
    room: String,
    creationDate: {type:Date, default:Date},
    edited: {type:Date, default:Date},
    status: String
})

mongoose.model('Room', room);

module.exports = mongoose.model("Room", room);