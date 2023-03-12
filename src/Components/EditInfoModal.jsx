import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';

class EditInfoModal extends Component {
    state = {
        firstname: "",
        lastname: "",
        selectedFile: null,
        image: ""
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.open} toggle={this.props.toggle} >
                    <ModalHeader toggle={this.props.toggle}>Appcademix</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.submitForm}>
                            <FormGroup>
                                <Label>First Name</Label>
                                <Input type="text" onChange={(e) => this.setState({ firstname: e.target.value })} value={this.state.firstname} required />
                            </FormGroup>
                            <FormGroup>
                                <Label>Last Name</Label>
                                <Input type="text" onChange={(e) => this.setState({ lastname: e.target.value })} value={this.state.lastname} required />
                            </FormGroup>
                            <FormGroup>
                                <Label className="btn btn-primary">Upload Image
                                        <Input type="file" onChange={(val) => this.setState({ selectedFile: val.target.files[0] })} ></Input>
                                </Label>
                                {this.state.selectedFile && this.state.selectedFile.name}
                            </FormGroup>
                            <Button className="btn-modal-primary">Update</Button>
                            <Button className="btn-modal-secondary" onClick={this.props.toggle}>Cancel</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

    componentDidMount = async () => {
        try {
            let response = await fetch("http://localhost:9000/api/users/" + localStorage.getItem("username"))
            let profile = await response.json()
            this.setState({
                firstname: this.capFirst(profile.firstname),
                lastname: this.capFirst(profile.lastname)
            })
            console.log(profile)
        } catch (e) {
            console.log(e)
        }
    }


    capFirst = string => {
        if (string)
            return string.charAt(0).toUpperCase() + string.slice(1)
    }

    submitForm = async (e) => {
        e.preventDefault()
        let profile = {
            firstname: this.state.firstname,
            lastname: this.state.lastname
        }
        try {
            let response = await fetch("http://localhost:9000/api/users/" + localStorage.getItem("username"), {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
            })
            console.log(this.state.selectedFile)
            if (this.state.selectedFile) {
                let fd = new FormData();
                fd.append("profile", this.state.selectedFile)
                try {
                    let fileUploaded = await fetch("http://localhost:9000/api/users/" + localStorage.getItem("username") + "/image", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("access_token")
                        },
                        body: fd
                    })
                    this.setState({
                        image: await fileUploaded.json()
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            profile = {
                ...profile,
                image: this.state.image.image
            }
            if (response.ok) {
                this.props.toggle(profile)
            }
            else
                console.log("Incorrect login")
        } catch (e) {
            console.log(e)
        }
    }
}

export default EditInfoModal;