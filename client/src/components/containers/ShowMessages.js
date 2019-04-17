import React from "react";

class ShowMessages extends React.Component {
    render() { 
        return (
            <div className="log-form-old-messages">
                <div>
                    Previous Messages
                </div>
                <div>
                    <ul>
                        <div>
                            <div id='chat'>
                                {this.props.messages.map((message, i)=>{
                                    return(
                                        <div key={i}>{message.author}: {message.message}</div>
                                    )
                                })}
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
          );
    }
}
 
export default ShowMessages;