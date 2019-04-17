import React, { Component } from 'react';
import './App.css';
import PropagateNewMessage from './components/containers/PropagateNewMessage'
import ShowMessages from './components/containers/ShowMessages'
import LoggedInUsers from './components/containers/LoggedInUsers'
import Username from './components/username'
import ChosenRoom from './components/containers/ChosenRoom'
import Adminlogin from './components/admin/Adminlogin'
import io from "socket.io-client";
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      socket:null,
      username:'',
      message:'',
      allMessages:[],
      rooms:[],
      error:'',
      room:'Main',
      users:[],
      currentRoom:'',
      user:'',
      admin:false
      
    }
    this.socket =  io('localhost:5000');
  }
  //username query
  submitUsername = e =>{
    e.preventDefault()
    this.socket.emit('NEW_USER', this.state.username, ()=>{
      this.setState({user:this.state.username, error:'Username Taken'})
    })
  }
  handleChange = event => {
    event.preventDefault();
    this.setState({
        [event.target.id]: event.target.value
    });
  }

///////////Realtime Sockets///////////
componentDidMount(){
  this.socket.on('USER_ADDED', data=>{
    this.setState({users:data}) 
  })
  this.socket.on('UPDATE_CHAT', data=>{
    this.addMessage(data)
  })
  this.socket.on('UPDATE_ROOMS', (rooms, currentRoom)=>{
    console.log(currentRoom)
    this.setState({rooms:rooms, currentRoom:currentRoom})
  })
  this.socket.on('NEW_MESSAGE', data=>{
    this.addMessage(data)
  })
}
/////Display Message/////
addMessage = data => {
  this.setState({messages: [...this.state.messages, data]});
}
//send message//
sendMessage = ev => {
  ev.preventDefault();
  this.socket.emit('SEND_MESSAGE', {
      author: this.props.user,
      message: this.state.message,
      room: this.state.room
  });
  this.setState({message: ''});
}
showAdmin=()=>{
  this.setState({admin:true});
}
showUser=()=>{
  this.setState({admin:false});
}
  render() {
///////////Populating Rooms///////////
const {rooms, user, room, admin} = this.state

let roomName=[]
rooms.forEach(room=>{
    return roomName.push(room)
})
///////////Changing Rooms///////////
this.handleRoomChange = e =>{
  if(room===e.target.value){
    alert('You are already in this room')
  }else{
    this.socket.emit('SWITCH_ROOM', e.target.value)
    this.setState({room:e.target.value})
  }

  
}

    return (
<div>
  {
    !user?
    <div>
      
      {
        !admin?
        
        <div>
          <h1>Login</h1>
          <button onClick={this.showAdmin}>Admin</button>
          <Username change={this.handleChange} submit={this.submitUsername} user={this.state.username}/>
        </div>
        :
        <div>
          <button onClick={this.showUser}>User</button>
          <Adminlogin/>
        </div>
      }
    </div>
    :
    <div id='contentWrap'>
    <h1 align="center">{room} Chatroom</h1>
      <LoggedInUsers online={this.state.users}/>
      <ChosenRoom rooms={roomName} value={this.state.room} onChangeValue={this.handleRoomChange}/>
      <ShowMessages messages={this.state.messages}/>
      <PropagateNewMessage message={this.state.message} change={ev=>this.setState({message: ev.target.value})} send={this.sendMessage}/>    
    </div>
  }
  
  
</div>
    );
  }
}

export default App;
