var express = require('express');
var router = express.Router();
var chatRooms = require('../models/chatRooms');
var bParser = require('body-parser');

router.use(bParser.json())
router.use(bParser.urlencoded({extended: true}));



//get all rooms
router.get('/api/room', function(req, res, next) {
  chatRooms.find((e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

//save rooms
router.post("/api/room", (req,res)=>{
  var data = new chatRooms(req.body);
  data.save()
  .then(
    res.redirect('/')
  )
});

router.get('/api/room/delete/:id', function(req, res, next) {
  chatRooms.findByIdAndDelete({_id:req.params.id},(e, results)=>{
    if(e) throw e;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

module.exports = router;
