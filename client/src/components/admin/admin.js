import React, { Component } from 'react';
import History from "./history";
import Events from "./events";
import Rooms from "./rooms";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import '../../resources/style.css';



class Admin extends Component {

  constructor(props){
    super(props)
    this.click1Event=this.click1Event.bind(this)
    this.click1History=this.click1History.bind(this)
    this.click1Rooms=this.click1Rooms.bind(this)
    this.state={
        eventTable:'',
        eventShow:false,
        historyTable:'',
        historyShow:false,
        roomsTable:'',
        roomsShow:false
    }
  }


  logout(){
    window.location.replace('/');
  }

  click1Event(){
    this.setState({eventShow:true, eventTable:<Events/>, historyShow:false, roomsShow:false, roomsTable:'', historyTable:''});
    }
    click1History(){
    this.setState({eventShow:false, eventTable:'', historyShow:true, roomsShow:false, roomsTable:'', historyTable:<History/>});
    }
    click1Rooms(){
    this.setState({eventShow:false, eventTable:'', historyShow:false, roomsShow:true, roomsTable:<Rooms/>, historyTable:''});
    }
    
      render() {
            const {eventTable, roomsTable,historyTable}= this.state
    
        return (
                <div className="marginLeft">
                    <h1 class="header-text">Admin Section</h1>
                    <h5 class="logout-Button"><Button type="submit" onClick={this.logout}>Logout</Button></h5>
                    <Button onClick={this.click1Event}>Event Table</Button>
                  
                    
                    <Button onClick={this.click1History}>Chat History Table</Button>
                    
                    
                    <Button onClick={this.click1Rooms}>Rooms Table</Button>
                    {roomsTable}{historyTable}{eventTable}
                    
                   
                </div>
        );
      }
}

export default Admin;