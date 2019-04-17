import React from "react";

class PropagateNewMessage extends React.Component {
    render() { 
        return (

            <div className="log-form">
            
                <input type="text" placeholder="message" value={this.props.message} onChange={this.props.change} />
                <br/>
                <button onClick={this.props.send} className="btn">Send</button>
            </div>
          );
    }
}
 
export default PropagateNewMessage;