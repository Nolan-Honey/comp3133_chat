import React, { Component } from 'react';
import './App.css';
import PropagateNewMessage from './components/containers/PropagateNewMessage'
import ShowMessages from './components/containers/ShowMessages'
import LoggedInUsers from './components/containers/LoggedInUsers'
import Username from './components/username'
import ChosenRoom from './components/containers/ChosenRoom'
import Adminlogin from './components/admin/Adminlogin'
import { Button } from "react-bootstrap";
import io from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.css';
import background from '../../client/src/resources/bridge.jpg';
import '../../client/src/resources/style.css';

// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import AppBar from 'material-ui/AppBar';

var pic = {
  height: "100vh",
  backgroundImage: `url(${background})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}

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
  logout(){
    window.location.replace('/');
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

//socket
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
//message display
addMessage = data => {
  this.setState({allMessages: [...this.state.allMessages, data]});
}
//send message
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
const {rooms, user, room, admin} = this.state

let roomName=[]
rooms.forEach(room=>{
    return roomName.push(room)
})
//switch room
this.handleRoomChange = e =>{
  if(room===e.target.value){
    alert('You are already in this room')
  }else{
    this.socket.emit('SWITCH_ROOM', e.target.value)
    this.setState({room:e.target.value})
  }

  
}

return (
<section style={pic} className="fullscreen-viewController">
  <div>
    {
      !user?
      <div>
        
        {
          !admin?
          
          <div className="marginLeft">
            <br></br>
            <h1 align="center">Welcome to Chat Emporium</h1>
            <Button variant="danger" type="submit" onClick={this.showAdmin}>Admin</Button>
            <Username change={this.handleChange} submit={this.submitUsername} user={this.state.username}/>
          </div>
          :
          <div>
            <br></br><br></br>
            <Button variant="warning" className="marginLeft" onClick={this.showUser}>User</Button>
            <Adminlogin />
          </div>
        }
      </div>
      :
      <div id='contentWrap'>
      <h1 align="center">{room} Chatroom</h1>
      <h5 class="logout-Button"><Button className="marginLeft" type="submit" onClick={this.logout}>Logout</Button></h5>
        <br></br>
        <LoggedInUsers online={this.state.users}/>
        <br></br>
        <ChosenRoom rooms={roomName} value={this.state.room} onChangeValue={this.handleRoomChange}/>
        <br></br>
        <ShowMessages allMessages={this.state.allMessages}/>
        <br></br>
        <PropagateNewMessage message={this.state.message} change={ev=>this.setState({message: ev.target.value})} send={this.sendMessage}/>    
      </div>
    }
    
    
  </div>
</section>
    );
  }
}

export default App;
