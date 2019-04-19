import React from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/style.css';
class Username extends React.Component {


    render() { 
        return (
            <div>
                <form onSubmit={this.props.submit} >
                <span>
                    Chat Login
                </span>
                <FormGroup controlId="username" >
                    <label>Nickname</label>
                    <FormControl autoFocus value={this.props.user} onChange={this.props.change}/>
                </FormGroup>
                <Button type="submit">Login</Button>
                <p>{this.error}</p>
                </form>
            </div>
          );
    }
}
 
export default Username;