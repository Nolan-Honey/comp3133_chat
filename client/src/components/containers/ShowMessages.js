import React from "react";
import 'bootstrap/dist/css/bootstrap.css';


class ShowMessages extends React.Component {
    render() { 
        return (
            <div className="log-form2">
                <div>
                    Previous Messages
                </div>
                <div>
                    <ul>
                        <div>
                            <div id='chatEmporium'>
                                {this.props.allMessages.map((message, i)=>{
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