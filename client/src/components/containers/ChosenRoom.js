import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../client/src/resources/style.css'

class ChosenRoom extends React.Component {

    render() { 
        return (
            <div className="marginLeft box1">
                <div>
                    Chat Rooms
                </div>
                <div>
                    <ul>
                        <div>
                            <div id='rooms'>
                                {
                                    this.props.rooms.map((room, i)=>{
                                        return <li><button key={i} onClick={this.props.onChangeValue} value={room}>{room}</button></li>
                                    })
                                }
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
          );
    }
}
 
export default ChosenRoom;