import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../client/src/resources/style.css'

class LoggedInUsers extends React.Component {

    render() { 
        return (
            <div className="marginLeft box1">
                 <div>
                    Online Users
                </div>
                <div>
                    <ul>
                        {
                            this.props.online.map((user, i)=>{
                                return <li class="list" key={i}>{user}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
          );
    }
}
 
export default LoggedInUsers;