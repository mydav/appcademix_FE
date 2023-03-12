import React, { Component } from "react";
import { Comment, Header, Icon } from "semantic-ui-react";
import Moment from "react-moment";
import { withRouter, Link } from 'react-router-dom'
import { toast } from "react-toastify";
import {
  Row,
  Input,
  Form,
  FormGroup,
  Col,
  Container,
  Button,
  Modal, ModalHeader, ModalBody,ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import InnerComment from "./InnerComment";
import LikeButton from "./LikeButton";


const mapStateToProps = state => state;

class CommentComponent extends Component {
  state = {
    comments: [],
    commentId: "",
    commentUsername: "",
    commentFullname: "",
    repliedBy: "",
    replyMsg: "",
    commentInputForEdit:"",
    commentForDeleteId:"",
    postId: "",
    openCommentBox: false,
    openEditCommentBox: false,
    deleteModalIsOpen: false,
  };



  render() {
    console.log(this.props.comments);
    return (
      <Container className="mb-5">


{this.state.commentForDeleteId && this.state.deleteModalIsOpen &&

<Modal isOpen={this.state.deleteModalIsOpen} toggle={this.toggleDelete} >
<ModalHeader toggle={this.toggleDelete}></ModalHeader>
<ModalBody>

Do you really want to Delete this comment?
</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggleDelete}>Cancel</Button>
          <Button color="danger" onClick={()=>this.deleteComment(this.state.commentForDeleteId)}>Delete</Button>
        </ModalFooter>
      </Modal>
                    }



        <Comment.Group threaded>
          <Header as="h3" dividing>
            Comments
          </Header>

          {this.props.comments.length > 0 &&
            this.props.comments.map((comment, i) => (
              <Comment key={i}>
                
                <Comment.Avatar src={comment.userInfo.image} />
                <Row>
                <Col className=" col-8">
                <Comment.Content>
                  <Comment.Author as="a">
                    {comment.userInfo.firstname} {comment.userInfo.lastname}
                    {/* <small>
                                                <h6 style={{ fontSize: "small", paddingTop: "0.5em" }}><Link className="post-username" to={"/profile/" + comment.userInfo.username}>{"@" + comment.userInfo.username}</Link></h6>
                                                </small> */}
                  </Comment.Author>

                  <Comment.Metadata>
                    <div>
                      <Moment fromNow>{comment.updatedAt}</Moment>
                    </div>
                  </Comment.Metadata>
                  {this.state.openEditCommentBox && this.state.commentId === comment._id ? null : <Comment.Text>{comment.comment}</Comment.Text>}
                  
                  <Comment.Actions>
     {/* <---------------------------------Reply Comment----------------------------------------> */}
                    { !this.state.openCommentBox &&  <><Comment.Action
                      onClick={() =>  this.setState({
                          commentId: comment._id,
                          commentUsername: comment.userInfo.username,
                          commentFullname: `${comment.userInfo.firstname} ${comment.userInfo.lastname}`,
                          openCommentBox: !this.state.openCommentBox
                        })
                      }
                    >
                      <a>
                        <Icon link name="chat" />
                      </a>
                    </Comment.Action>

         {/* <--------------------------------------End of Reply Comment--------------------------------> */}

          {/* <-----------------------------------Edit and Delete Comment--------------------------------> */}
                    {comment.userInfo.username ===
                      this.props.userInfo.username && (
                      <>
                        <Comment.Action
                          onClick={() =>
                            this.setState({
                              commentId: comment._id,
                              commentInputForEdit: comment.comment,
                              openCommentBox: !this.state.openCommentBox,
                              openEditCommentBox: !this.state.openEditCommentBox,
                              postId: comment.postid
                            })}>
                          <a><Icon link name="edit"/></a>
                        </Comment.Action>

                        <Comment.Action
                          onClick={() =>{
                            this.setState({
                              
                              deleteModalIsOpen:true,
                              commentForDeleteId : comment._id,
                              postId: comment.postid
                            })
                            console.log("Comment id", comment._id)}}>
                          <a><Icon link name="trash alternate outline" /></a>
                          
                        </Comment.Action>

                          
                          
                          
                          </>
                      
                    )} </>}
          {/* <-------------------End of Delete and edit Comment--------------------------------> */}
                  </Comment.Actions>
                </Comment.Content>
           
                     

                          </Col>
                <Col className=" col-1">
                           <Container> <LikeButton count={comment.upvotes} click={() => this.rateComment(comment._id)} upVotedByUser={comment.upvoted} /></Container>

                          </Col>
</Row>
               

                {/* <------Box for comment Input-------------> */}
                {this.state.commentId === comment._id &&
                  this.state.openCommentBox && (
                    <Form onSubmit= {this.postReplyOrEdit}>
                      <Col>
                        <button
                          type="button"
                          className="close mt-3"
                          aria-label="Close"
                          onClick={() =>
                            this.setState({
                              commentId: "",
                              commentUsername: "",
                              repliedBy: "",
                              replyMsg: "",
                              commentFullname: "",
                              openCommentBox: !this.state.openCommentBox,
                              commentInputForEdit:"",
                              openEditCommentBox:false
                            })
                          }
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <FormGroup>
                          { this.state.openEditCommentBox ?
                            <Input
                            className="rounded-pill ml-4 mt-2"
                            type="text"
                            onChange={e =>
                              this.setState({ commentInputForEdit: e.target.value })
                            }
                            value={this.state.commentInputForEdit}
                         
                          />
                           : <Input
                            className="rounded-pill ml-4 mt-2"
                            type="text"
                            onChange={e =>
                              this.setState({ replyMsg: e.target.value })
                            }
                            value={this.state.replyMsg}
                            placeholder={`reply to @ ${this.state.commentFullname}`}
                          />}
                        </FormGroup>
                       
                        <Button className="btn-modal-primary rounded-pill ml-4">
                         { this.state.openEditCommentBox ?  "Edit Comment" : "Reply Post"}
                        </Button>
                      
                      </Col>
                    </Form>
                  )} {/* <------end of Box for comment Input-------------> */}

                {/* <------Inner reply-------------> */}

                <InnerComment replies={comment.replies} comment={comment} refresh={this.props.refresh}/>

                  {/* <------Inner reply-------------> */}
              </Comment>
            ))}

          {/* 
        <Form reply>
          <Form.TextArea  value={this.state.commentId}/>
          <Button
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
          />
        </Form> */}
        </Comment.Group>
      </Container>
    );
  }

  rateComment = async id => {
  if(!this.props.accessToken){
    
  toast.error("Login to rate this comment!");
  
  }
  else{
  let response = await fetch(`http://localhost:9000/api/rate/comment/${id}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + this.props.accessToken
    }
  });
      this.props.refresh();
    }
  
  };

  toggleDelete = () => {
    this.setState({
        deleteModalIsOpen: !this.state.deleteModalIsOpen,
        commentForDeleteId : ""
    })
  }

//rework this!!!
  postReplyOrEdit = async e => {
    e.preventDefault();
    try {

      if(!this.props.accessToken){
        this.setState({
          openCommentBox: false
        }) 
        toast.error("Login to reply this comment!");
        }
        else{

          if(this.state.commentInputForEdit){
            
            await this.updateComment()
          }
    
          else{
    
          let replyBody = {
            reply: this.state.replyMsg
          };
          // http://localhost:9000/api/reply/commentID
          let response = await fetch(
            "http://localhost:9000/api/reply/" + this.state.commentId,
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
              },
              body: JSON.stringify(replyBody)
            }
          );
    
          if (response.ok) {
            this.props.refresh();
          }
    
          this.setState({
            commentId: "",
            commentUsername: "",
            repliedBy: "",
            replyMsg: "",
            commentFullname: "",
            openCommentBox: false,
         
          })
        
          }
        }
    
    } catch (error) {
      console.log(error);
    }



  };

  componentDidMount = () => {
    this.setState({
      comments: this.props.comments
    });
  };

  //rework this
  updateComment = async () => {
    //    /api/comments/:postid/:username/:commentid
    // commentForEdit:"",
    // commentForEditID:"",
    //commentForEditPostID:""
    try {
       

        const {  commentId, commentInputForEdit, postId } = this.state
        let bodyForPUT = { comment: commentInputForEdit }
        let response = await fetch(`http://localhost:9000/api/comments/${postId}/${this.props.userInfo.username}/${commentId}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.props.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyForPUT)
        })
        if (response.ok) {
            this.setState({
              commentInputForEdit: "",
              commentId: "",
                openForEdit: false,
                openCommentBox:false,
                openEditCommentBox:false
            })
        }

        this.props.refresh();
    } catch (error) {
        console.log(error)
    }
};

deleteComment = async (id) => {
    // api/comments/:commentid/posts/:postid?username=:username
    try {
    console.log()
      
      const {  commentForDeleteId , postId} = this.state
      console.log(id, "id")
        let response = await fetch(`http://localhost:9000/api/comments/${id}/posts/${postId}?username=${this.props.userInfo.username}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + this.props.accessToken,
                "Content-Type": "application/json"
            }
        })
        if (response.ok) {
            this.setState({
              commentForDeleteId : "",
                openForEdit: false,
                deleteModalIsOpen: false,
            })
        }
        this.props.refresh();
    } catch (error) {
        console.log(error)
    }
};

}
export default withRouter (connect(mapStateToProps)(CommentComponent));
