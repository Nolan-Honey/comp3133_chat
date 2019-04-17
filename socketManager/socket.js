var rooms = []
var users = {}
var User = require('../models/Users.js');
var Chat = require('../models/Chats.js');
var S = require('../models/Sockets.js');
var EventLog = require('../models/Events.js');
var Private = require('../models/PrivateChats.js');
var Rooms = require('../models/Rooms');

module.exports = (io)=>{
    io.sockets.on('connection', (socket)=> {
        Rooms.find((e, res)=>{
            if(e) {
                throw e;
            }
            res.forEach((i)=>{
                if (rooms.includes(i.room)){
                    console.log(i.room + 'already exists.')
                }else{
                    console.log(i.room + 'can be added.')
                    rooms.push(i.room)
                }
            })
        });
    //store event
        var connectEvent=new EventLog({type:'CONNECTION', socket:socket.id, room:'Lobby'})
        connectEvent.save((e)=>{
                if (e) throw e;
                     console.log('\n Event socket '+ connectEvent.socket +' type '+connectEvent.type+"\n connected at "+ connectEvent.connect +'  room name '+connectEvent.room+' database saved at'+ connectEvent.connect)
            })
        socket.on('NEW_USER',  (data ,callback) =>{ 
        //if a user exists in the dictionary, return an eor message to client
            if (data in users){
                callback(false);
            }
            else {
            //Create new one and store user in dictionary if exists
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            //username in db
                var newUser = new User({username: data})
                newUser.save((e)=>{
                    if (e) throw e;
                console.log('\nUser '+newUser.username+" saved to db.")
                })
            //new socket in db
                var newS=new S({socket_id:socket.id, createdBy:newUser.username})
                newS.save((e)=>{
                    if (e) throw e;
                    console.log('\nSocket id '+newS.socket_id+" created by "+ newS.createdBy+" saved to db at "+ newS.connectTime)
                })
            //event in db
                var newUserEvent=new EventLog({type:'NEW USER',name:newUser.username, socket:socket.id, room:'Main Room'})
                newUserEvent.save((e)=>{
                    if (e) throw e;
                    console.log('\nEvent type '+newUserEvent.type+'created by ' + newUserEvent.name + 'for socket '+newUserEvent.socket+' in the room'+newUserEvent.room+'saved to db at '+ newUserEvent.connect)
                })
                socket.room = 'Main';
            //adds username to the global list and sends them to the main room
                socket.join('Main');
                message=({author:'Chat admin', message: 'You have connected to Main room'})
                message2=({author:'Chat admin', message: socket.nickname + ' has connected to this room'})
                socket.emit('UPDATE_CHAT', message);
                socket.broadcast.to('Main').emit('UPDATE_CHAT', message2);
                socket.emit('UPDATE_ROOMS', rooms, 'Main');
        }
    })

        const updateNicknames=()=> {
            io.sockets.emit('USER_ADDED', Object.keys(users));
        }


        //save messages to the db
        socket.on('SEND_MESSAGE',  (data)=> {
            var newMessageEvent=new EventLog({type:'MESSAGE SENT', name:socket.nickname, socket:socket.id, room:data['room']})
            newMessageEvent.save((e)=>{
                if (e) throw e;
                console.log('Event type '+newMessageEvent.type+'created by ' + newMessageEvent.name + 'for socket '+newMessageEvent.socket+' in the room '+newMessageEvent.room+'saved to db at '+ newMessageEvent.connect)
            })
            var newMsg = new Chat({msg: data['message'], nick: socket.nickname, room: data['room']})
            newMsg.save( (e) =>{
                if (e) throw e;
                console.log('Message "'+newMsg.msg+'" by ' + newMsg.nick + 'from room '+newMsg.room)
                io.sockets.in(socket.room).emit('NEW_MESSAGE', {author:socket.nickname, message:data['message']})
            })
        })
        //switch room
        socket.on('SWITCH_ROOM', (newroom)=>{
            socket.leave(socket.room);
        //store leave room event
            var leaveRoomEvent=new EventLog({type:'LEAVE ROOM', name:socket.nickname, socket:socket.id, room:socket.room})
            leaveRoomEvent.save((e)=>{
                if (e) throw e;
                console.log('\nEvent type '+leaveRoomEvent.type+'created by ' + leaveRoomEvent.name + 'for socket '+leaveRoomEvent.socket+' in the room '+leaveRoomEvent.room+'saved to db at '+ leaveRoomEvent.connect)
            })
            socket.join(newroom);
        //store join room event
            var joinRoomEvent=new EventLog({type:'JOIN ROOM', name:socket.nickname, socket:socket.id, room:newroom})
            joinRoomEvent.save((e)=>{
                if (e) throw e;
                console.log('\nEvent Type '+joinRoomEvent.type+'created by ' + joinRoomEvent.name + 'for socket '+joinRoomEvent.socket+'in the room '+joinRoomEvent.room+'saved to db at '+ joinRoomEvent.connect)
            })
            message3=({author:'Chat admin', message: 'You have connected to ' + newroom})
            socket.emit('UPDATE_CHAT', message3);
        // sent message to old room
            message4=({author:'Chat admin', message: socket.nickname+' has left this room'})
            socket.broadcast.to(socket.room).emit('UPDATE_CHAT', message4 );
        // update socket session room title
            socket.room = newroom;
        //let users know new user has joined the room
            message5=({author:'Chat admin', message: socket.nickname+'  has joined this room'})
            socket.broadcast.to(newroom).emit('UPDATE_CHAT', message5);
            socket.emit('UPDATE_ROOMS', rooms, newroom);
        });
        //when a user disconnects
        socket.on('disconnect',  (data) =>{
        if (!socket.nickname) return;
        //remove username from dictionary to allow its reuse
        delete  users[socket.nickname];
            S.find({socket_id:socket.id},(e,socks)=>{
                if (e) throw e;
                //update disconnect time for socket in database 
                socks.forEach((sock)=> { 
                    sock.disconnectTime=new Date();
                    //save the update
                    sock.save((e)=>{
                        if (e) throw e;
                        console.log( "\nSocket id " + sock.socket_id + "disconnected timeline " + sock.disconnectTime);
                    })
                })
            })
        //store disconnect event
            var disconnectEvent=new EventLog({type:'DISCONNECT', disconnect: new Date(), name:socket.nickname, socket:socket.id})
            disconnectEvent.save((e)=>{
                if (e) throw e;
                console.log('\nEvent type '+disconnectEvent.type+' created by ' + disconnectEvent.name + ' for socket '+disconnectEvent.socket+' saved to db at '+ disconnectEvent.disconnect)
            })
        //let other users in the room know user has disconnected
            message6=({author:'Chat admin', message: socket.nickname+' has disconnected'})
            socket.broadcast.emit('UPDATE_CHAT', message6);
            socket.leave(socket.room);
            updateNicknames();
        });
    })
}