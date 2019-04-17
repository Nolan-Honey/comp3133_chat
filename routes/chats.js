var express = require('express');
var router = express.Router();
var C = require('../models/chatRooms.js');

//all messages
router.get('/api/history', function(req, res, next) {
  C.find((e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

//save messages
router.post('/api/history', function(req, res, next) {
  C.create(req.body, function (e, chat) {
    if (e) return next(e);
    res.json(chat);
  });
});

module.exports = router;
