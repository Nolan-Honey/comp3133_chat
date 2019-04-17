import React from "react";
class LoggedInUsers extends React.Component {

    render() { 
        return (
            <div>
                 <div>
                    ONLINE USERS
                </div>
                <div>
                    <ul>
                        {
                            this.props.online.map((user, i)=>{
                                return <li key={i}>{user}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
          );
    }
}
 
export default LoggedInUsers;