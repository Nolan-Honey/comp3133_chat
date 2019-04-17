import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Admin from "./admin";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

class Adminlogin  extends Component {

    constructor(props){
        super(props);

        this.state={
            databaseUser:'',
            databasePassword:'',
            username: "",
            password: "",
            isAdmin:false
        };
    }
    componentWillMount(){
          axios.get('http://localhost:5000/api/admin')  
           .then(response => this.setState({databaseUser: response.data[0].username, databasePassword:response.data[0].password}))
    }
    validateForm(){
        return this.state.username === this.state.databaseUser && this.state.password === this.state.databasePassword;
    }
    
    handleChange = event => {
        console.log([event.target.id]+"  "+ event.target.value)
       this.setState({
            [event.target.id]: event.target.value
        });
    }



    render() { 
        const {isAdmin}=this.state
        this.handleSubmit = event => {
            event.preventDefault();
            this.setState({isAdmin:true})
        }
        return (
            <div class="admin-container" >
                {
                    !isAdmin?
                    <form onSubmit={this.handleSubmit}>
                        <span>
                            Admin Login
                        </span>
                        <FormGroup controlId="username">
                            <label>username</label>
                            <FormControl autoFocus value={this.state.username} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup controlId="password">
                            <label>password</label>
                            <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                        </FormGroup>
                        <Button block disabled={!this.validateForm()} type="submit">Login</Button>
                    </form>
                    :
                    <div>
                        <Admin/>
                    </div>
                }
                
            </div>
          );
    }
}
 
export default Adminlogin ;