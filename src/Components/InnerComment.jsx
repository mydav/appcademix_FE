import React, { Component } from "react";
import {  Comment,  Header, Icon } from "semantic-ui-react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { Row, Input, Form, FormGroup, Col, Container, Button,   Modal, ModalHeader, ModalBody,ModalFooter} from "reactstrap";
import { connect } from "react-redux"

const mapStateToProps = state => state

class InnerComponent extends Component {
  state = {
    openReplyBoxForEdit: false,
    commentId: "",
    replyId: "",
    replyInput:"",
    deleteReplyModalIsOpen:true,
    replyIdForDelete:"" ,                      

      comments:[],
      commentUsername:"",
      commentFullname:"",
      repliedBy:"",
      replyMsg:"",
      commentIdForDelete:"",
      openCommentBox: false
  };

  render() {
    const { replies, comment } = this.props
    return (
        <>

{this.state.commentIdForDelete && this.state.deleteReplyModalIsOpen &&

<Modal isOpen={this.state.deleteReplyModalIsOpen} toggle={this.toggleDelete} >
<ModalHeader toggle={this.toggleReplyDelete}></ModalHeader>
<ModalBody>

Do you really want to Delete this Reply?
</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggleReplyDelete}>Cancel</Button>
          <Button color="danger" onClick={this.deleteReplyComment}>Delete</Button>
        </ModalFooter>
      </Modal>
                    }
        {replies.length > 0 &&
           replies.map((reply,index) => (
              <Comment.Group key={index}>
                <Comment>
                  <Comment.Avatar src={reply.userInfo.image} />
                  <Comment.Content>
                    <Comment.Author as="a">
                      {reply.userInfo.firstname} {reply.userInfo.lastname}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>
                        <Moment fromNow>{reply.updatedAt}</Moment>
                      </div>
                    </Comment.Metadata>
                   {this.state.openReplyBoxForEdit ? null :  <Comment.Text>{reply.reply}</Comment.Text>}
                    <Comment.Actions>

    {/* <-------------------start of Delete and edit Comment--------------------------------> */}
                    { reply.userInfo.username === this.props.userInfo.username && <>
                     <Comment.Action
                     onClick={() =>
                       this.setState({
                         commentId: comment._id,
                         replyId: reply._id,
                         replyInput:reply.reply,
                         openReplyBoxForEdit: !this.state.openReplyBoxForEdit
                       })}>
                        <a><Icon link name="edit" /></a>
                   </Comment.Action>

                   <Comment.Action
                     onClick={() =>
                       this.setState({
                        commentIdForDelete: comment._id,
                        replyIdForDelete: reply._id,
                         deleteReplyModalIsOpen: true
                       })
                     } ><a><Icon link name="trash alternate outline" />  </a> 
                   </Comment.Action>

                   
                </>}


                {/* <-------------------End of Delete and edit Comment--------------------------------> */}
               </Comment.Actions> 
                  </Comment.Content>
                  {/* <------Box for comment Input-------------> */}
                {this.state.replyId === reply._id &&
                  this.state.openReplyBoxForEdit && (
                    <Form onSubmit={this.editReplyComment}>
                      <Col>
                        <button
                          type="button"
                          className="close"
                          aria-label="Close"
                          onClick={() =>
                            this.setState({
                                openReplyBoxForEdit: false,
                                commentId: "",
                                replyId: "",
                                replyInput:""

                                
                              
                              
                            })
                          }
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <FormGroup>
                          <Input
                            className="rounded-pill"
                            type="text"
                            onChange={e =>
                              this.setState({ replyInput: e.target.value })
                            }
                            value={this.state.replyInput}
                           
                          />
                        </FormGroup>
                        <Button className="btn-modal-primary rounded-pill">
                          Edit Comment
                        </Button>
                      </Col>
                    </Form>
                  )}
                </Comment>
              </Comment.Group>
            ))}
    </>);
  }


  toggleReplyDelete= () => {
    this.setState({
        deleteReplyModalIsOpen: !this.state.deleteReplyModalIsOpen,
        commentId : "",
        replyIdForDelete:""
       
    })
}




  editReplyComment=async (e)=>{
    e.preventDefault()
try {

  const { commentId, replyId } = this.state
    let replyBody ={
        reply: this.state.replyInput
    }
    // `http://localhost:9000/api/reply/${commentId}`
    // /api/reply/:commentId/:replyId'
    let response = await fetch(`http://localhost:9000/api/reply/${commentId}/${this.state.replyId}`,{
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + this.props.accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(replyBody)
    })

    if(response.ok){
      this.setState({
      
        openReplyBoxForEdit: false,
        commentId: "",
        replyId: "",
        replyInput:""
       })
    }
    this.props.refresh()
} catch (error) {
    console.log(error)
    
}
    
   
  }


deleteReplyComment = async () => {
 
    try {
      const {  commentIdForDelete, replyIdForDelete } = this.state
        let response = await fetch(`http://localhost:9000/api/reply/${commentIdForDelete}/${replyIdForDelete}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + this.props.accessToken,
                "Content-Type": "application/json"
            }
        })
        if (response.ok) {
            this.setState({
              commentId: "",
                commentIdForDelete: "",
                replyId: "",
                replyIdForDelete:"",
                deleteReplyModalIsOpen: false
            })
        }
        this.props.refresh();
    } catch (error) {
        console.log(error)
    }
};


    componentDidMount=()=>{
        this.setState({
           comments: this.props.comments
        })
    }



}
export default connect(mapStateToProps) (InnerComponent)
