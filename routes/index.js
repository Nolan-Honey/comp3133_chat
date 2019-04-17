var express = require('express');
var router = express.Router();
var eventLog = require('../models/Events.js');
var Chat = require('../models/Chats.js');
var Admin = require('../models/Admin');


router.get('/api/eventlog', function(req, res, next) {
  eventLog.find((e, results)=>{
      if(e) throw e;
      res.header("Content-Type",'application/json');
      res.json(results)
  });
});

router.get('/api/eventLog/delete/:id', function(req, res, next) {
  eventLog.findByIdAndDelete({_id:req.params.id},(e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

router.get('/api/admin', (req,res,next)=>{
  Admin.find()
  .exec(function(error,admin){
      if (error){
          return next(error);
      }
      else{
          if (admin === null){
              var e = new Error('no');
              e.status=400;
              return next(e);
          }
          else{
              return res.send(admin)
          }
      }
  })
})

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
})
router.get("/api/history", (req, res) => {
  Chat.find({}, (e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.json(results)
  });
});
router.get('/api/history/delete/:id', function(req, res, next) {
  Chat.findByIdAndDelete({_id:req.params.id},(e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 
router.get("/api/chatEmporium", (req, res) => {
  Chat.find({room: "Chat Emporium"}, (e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
});

router.get("/api/mtg", (req, res) => {
  Chat.find({room: "Magic The Gathering room"}, (e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

module.exports = router;
