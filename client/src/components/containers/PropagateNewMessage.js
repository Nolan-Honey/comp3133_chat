import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../client/src/resources/style.css'
import { Button, FormGroup, FormControl } from "react-bootstrap";
class PropagateNewMessage extends React.Component {
    render() { 
        return (

            <div className="log-form marginLeft">
                <input className="messageBox" type="text" placeholder="say something nice..." value={this.props.message} onChange={this.props.change} />
                <br/><br/>
                <Button onClick={this.props.send} className="btn btn-info">Send</Button>
            </div>
          );
    }
}
 
export default PropagateNewMessage;