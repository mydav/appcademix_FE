import React, { Component } from 'react';
import { Button, Col, Row, Fade, Container, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'

class Register extends Component {
    state = {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        errorMessage: ""
    }

    render() {
        let { errorMessage } = this.state
        return (
            <Fade>
                <Container className="create-post register">
                    <Row>
                        <Col>
                            <Container>
                                <FormGroup>
                                    <h4 className="text-center">Register with:</h4>
                                    <Button href="http://localhost:9000/api/auth/google/callback" className="fab fa-google m-2"></Button>
                                    <Button href="http://localhost:9000/api/auth/facebook/callback" className="fab fa-facebook-f m-2"></Button>
                                </FormGroup>
                            </Container>
                            <h4 className="text-center">OR</h4>
                            <Container>
                                <Form onSubmit={this.submitPost}>
                                    <FormGroup>
                                        <Label>Firstname</Label>
                                        <Input type="text" onChange={(e) => this.setState({ firstname: e.target.value })} value={this.state.firstname} required></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Lastname</Label>
                                        <Input type="text" onChange={(e) => this.setState({ lastname: e.target.value })} value={this.state.lastname} required></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Username</Label>
                                        <Input type="text" onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} required></Input>
                                        {errorMessage.type === 'USERNAME_EXIST' && <Alert color="danger">{errorMessage.message }</Alert>}
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Password</Label>
                                        <Input type="password" onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} required></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Confirm password</Label>
                                        <Input type="password" onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={this.state.confirmPassword} required></Input>
                                        { this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword && <div class="error">
                                            The password does not match
                                        </div>
                                         }
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>E-Mail</Label>
                                        <Input type="email" onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} required />
                                        {errorMessage.type === 'EMAIL_EXIST' && <Alert color="danger">{errorMessage.message}</Alert>}
                                    </FormGroup>
                                    <Button className="btn-modal-primary">Register</Button>
                                </Form>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Fade>
        );
    }

    submitPost = async (e) => {
        e.preventDefault()
        let user = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }
        try {
            let response = await fetch("http://localhost:9000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            let credentials = await response.json()
            if (response.ok) {
                toast.success(credentials.message)
                this.props.history.push("/")
            }
            else
                toast.error("oops somethimg went wrong")
            if (credentials && credentials.type)
                this.setState({
                    errorMessage: credentials
                })
        } catch (ex) {

        }
    }
}

export default Register;