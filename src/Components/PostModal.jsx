import React, { Component } from "react";
import {
  Button,
  Fade,
  Row,
  Container,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { toast } from "react-toastify";
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton
} from "react-share";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";
import CommentComponent from "./CommentComponent";

const mapStateToProps = state => state;

class PostModal extends Component {
  state = {
    comments: [],
    commentLoading: true,
    comment: "",
    openForEdit: false,
    commentForEdit: "",
    commentForEditID: "",
    commentForEditPostID: "",
    videoPlayer: true,
    upvotes: false
  };

  render() {
    const shareUrl = window.location.href + "post/" + this.props.post._id;
    const title = this.props.post.title;
    return (
      <div>
        <Modal isOpen={this.props.open} toggle={this.props.toggle} size="xl">
          <ModalHeader toggle={this.props.toggle}></ModalHeader>
          <ModalBody>
            <Container className="section-modal">
              <Row>
                <Col>
                  <Row>
                    <img className="modal-image" src={this.props.post.image} />
                    <Col>
                      <h4 className="m-2">
                        {this.props.post.title.toUpperCase()}
                      </h4>
                      <a href={this.props.post.link}>
                        <Button className="m-2">View Link</Button>
                      </a>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h5 className="m-3">{this.props.post.description}</h5>
                    </Col>
                  </Row>
                </Col>
                <Col className="col-3">
                  <Row>
                    <Col>
                      {this.props.post.ratings.length > 0 &&
                      this.props.post.ratings.find(
                        ({ upvotedBy }) =>
                          upvotedBy === this.props.userInfo.username
                      ) ? (
                        <span
                          onClick={() => this.props.rate(this.props.post)}
                          className="rate2 mr-0"
                        >
                          <FontAwesome name="star" size="2x" />
                          <span className="rate-number">
                            {this.props.post.ratingsCount}
                          </span>
                        </span>
                      ) : (
                        <span
                          onClick={() => this.props.rate(this.props.post)}
                          className="rate mr-0"
                        >
                          <FontAwesome name="star" size="2x" />
                          <span className="rate-number">
                            {this.props.post.ratingsCount}
                          </span>
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <div className="details-post">
                      <h6>
                        <FontAwesome name="comment" />
                        <span className="m-1">
                          {this.props.post.commentsCount}
                        </span>
                      </h6>
                    </div>
                  </Row>
                  <Row>
                    <div className="details-post">
                      <h6>
                        {this.props.post.category == "Tech" && (
                          <FontAwesome className="mr-1" name="laptop" />
                        )}
                        {this.props.post.category == "Sales" && (
                          <FontAwesome className="mr-1" name="chart-bar" />
                        )}
                        {this.props.post.category}
                      </h6>
                    </div>
                  </Row>
                  <Row>
                    <div className="details-post">
                      <h6>
                        {this.props.post.difficulty == "Medium" && (
                          <FontAwesome name="dot-circle" />
                        )}
                        {this.props.post.difficulty == "Hard" && (
                          <>
                            <FontAwesome name="dot-circle" />
                            <FontAwesome name="dot-circle" />
                          </>
                        )}
                        <FontAwesome className="mr-1" name="dot-circle" />
                        {this.props.post.difficulty}
                      </h6>
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row className="p-4">
                {this.state.videoPlayer && (
                  <ReactPlayer
                    url={this.props.post.link}
                    onError={() => this.setState({ videoPlayer: false })}
                    controls={true}
                    playing={true}
                  />
                )}
              </Row>
              <Row>
                <Col className="mt-2 ml-4 ">
                  <Row>
                    <h6 style={{ fontSize: "medium", paddingTop: "0.5em" }}>
                      Posted By{" "}
                      <Link
                        className="post-username"
                        to={"/profile/" + this.props.post.username}
                      >
                        {"@" + this.props.post.username}
                      </Link>
                    </h6>
                  </Row>
                  <Row>
                    <h6 style={{ fontStyle: "italic", fontSize: "small" }}>
                      <Moment fromNow>{this.props.post.createdAt}</Moment>
                    </h6>
                  </Row>
                </Col>
                <Col className="m-2">
                  <Container className="text-right">
                    <h5 className="mr-4">Share it on:</h5>
                    <ul className="social-share list-unstyled list-inline">
                      <li className="list-inline-item">
                        <FacebookShareButton
                          url={shareUrl}
                          quote={title}
                          className="button"
                        >
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                      </li>
                      <li className="list-inline-item">
                        <TwitterShareButton
                          url={shareUrl}
                          title={title}
                          className="button"
                        >
                          <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                      </li>
                      <li className="list-inline-item">
                        <LinkedinShareButton
                          url={shareUrl}
                          title={title}
                          windowWidth={750}
                          windowHeight={600}
                          className="button"
                        >
                          <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                      </li>
                    </ul>
                  </Container>
                </Col>
              </Row>
            </Container>
            <Container className="mt-4">
              <Form onSubmit={this.postComment}>
                <Col>
                  <FormGroup>
                    {this.props.userInfo.username && (
                      <>
                        <img
                          className="comment-pic mr-3 p-2 "
                          src={this.props.userInfo.image}
                          style={{ maxHeight: "40px", maxWidth: "40px" }}
                          alt=" profile"
                        />
                        <Label className="font-weight-bold rounded-pill">
                          {this.capFirst(this.props.userInfo.firstname) +
                            " " +
                            this.capFirst(this.props.userInfo.lastname)}
                        </Label>
                      </>
                    )}
                    <Input
                      type="text"
                      onChange={e => this.setState({ comment: e.target.value })}
                      value={this.state.comment}
                      placeholder="Comment this post"
                    />
                  </FormGroup>
                  <Button className="btn-modal-primary rounded-pill">Comment</Button>
                </Col>
              </Form>
             <Container className="mt-4"> <CommentComponent  refresh={()=> this.getAllComments()} comments={this.state.comments}/></Container>
            </Container>

            {/*---------------COMMENTS*--------------------*/}
            {/* {this.state.comments &&
              !this.state.commentLoading &&
              this.state.comments.map((comment, index) => (
                <Container className="section-modal" key={index}>
                  {this.props.userInfo.username === comment.userInfo.username &&
                    !this.state.openForEdit && (
                      <div
                        className="penBg float-right"
                        onClick={() =>
                          this.setState({
                            openForEdit: true,
                            commentForEdit: comment.comment,
                            commentForEditID: comment._id,
                            commentForEditPostID: comment.postid
                          })
                        }
                      >
                        <FontAwesome name="pen" className=" penEdit" />
                      </div>
                    )}
                  <Row>
                    <img className="comment-pic" src={comment.userInfo.image} />
                    {this.state.commentForEditID !== comment._id && (
                      <Col>
                        <Row>
                          <h5 className="font-weight-bold">
                            <Link
                              className="comment-name"
                              to={"/profile/" + comment.userInfo.username}
                            >
                              {this.capFirst(comment.userInfo.firstname) +
                                " " +
                                this.capFirst(comment.userInfo.lastname)}
                            </Link>
                          </h5>
                        </Row>
                        <Row>
                          <h6
                            style={{ fontSize: "small", paddingTop: "0.5em" }}
                          >
                            <Link
                              className="post-username"
                              to={"/profile/" + comment.userInfo.username}
                            >
                              {"@" + comment.userInfo.username}
                            </Link>
                          </h6>
                        </Row>
                        <Row>
                          <h5 className="mt-3 mb-3">{comment.comment}</h5>
                        </Row>
                        <Row>
                          <span
                            style={{ fontStyle: "italic", fontSize: "small" }}
                          >
                            <Moment fromNow>{comment.createdAt}</Moment>
                          </span>
                          <Col>
                            <h6>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  this.setState({
                                    openForReply: !this.state.openForReply,
                                    replyToCommentID: comment._id
                                  })
                                }
                              >
                                Reply
                              </span>
                            </h6>
                          </Col>
                        </Row>
                      </Col>
                    )}
                    <span onClick={() => this.rateComment(comment._id)}>
                      {comment.upvoted ? (
                        <span className="rate2">
                          <FontAwesome name="heart" size="2x" />
                          <span className="rate-number">
                            {" "}
                            {comment.upvotes}
                          </span>
                        </span>
                      ) : (
                        <span className="rate">
                          <FontAwesome name="heart" size="2x" />
                          <span className="rate-number">
                            {" "}
                            {comment.upvotes}
                          </span>
                        </span>
                      )}
                    </span>
                    {this.state.openForEdit &&
                      this.state.commentForEditID === comment._id && (
                        <Col>
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() =>
                              this.setState({
                                openForEdit: false,
                                commentForEditID: "",
                                commentForEditPostID: ""
                              })
                            }
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <FormGroup>
                            <Label>Edit this comment:</Label>
                            <Input
                              type="textarea"
                              onChange={e =>
                                this.setState({
                                  commentForEdit: e.target.value
                                })
                              }
                              value={this.state.commentForEdit}
                            />
                          </FormGroup>
                          <Row>
                            <Button
                              className="btn-modal-primary m-3"
                              onClick={this.updateComment}
                            >
                              Update
                            </Button>
                            <Button onClick={this.deleteComment}>Delete</Button>
                          </Row>
                        </Col>
                      )}
                  </Row>
                </Container>
              ))} */}
          </ModalBody>
        </Modal>
      </div>
    );
  }

    componentDidMount = async () => {
        await this.getAllComments()
        await this.fetchPost()
    }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.openForEdit !== this.state.openForEdit) {
      await this.getAllComments();
      // this.props.refresh()
    }
  };

    fetchPost = async() => {
        try {
            await fetch("http://localhost:9000/api/posts/" + this.props.post._id)
        } catch (e) {
            console.log(e)
        }
    }

    rateComment = async (id) => {
        let response = await fetch(`http://localhost:9000/api/rate/comment/${id}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.props.accessToken
            }

        })
        this.getAllComments()
    }
  getAllComments = async () => {
    try {
      let response = await fetch(
        `http://localhost:9000/api/comments/${this.props.post._id}?sort=updatedAt`
      );
      let comments = await response.json();
      //    let sortedComments = comments.sort((a,b) =>b.createdAt - a.createdAt)
      this.setState({
        post: this.props.post,
        comments: comments.reverse()
      });
      console.log(this.state.comments);
      setTimeout(() => {
        this.setState({
          commentLoading: false
        });
      }, 500);
    } catch (e) {
      console.log(e);
    }
  };

  updateComment = async () => {
    //    /api/comments/:postid/:username/:commentid
    // commentForEdit:"",
    // commentForEditID:"",
    //commentForEditPostID:""
    try {
      const {
        commentForEdit,
        commentForEditID,
        commentForEditPostID
      } = this.state;
      let bodyForPUT = { comment: commentForEdit };
      let response = await fetch(
        `http://localhost:9000/api/comments/${commentForEditPostID}/${this.props.userInfo.username}/${commentForEditID}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + this.props.accessToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyForPUT)
        }
      );
      if (response.ok) {
        this.setState({
          commentForEdit: "",
          commentForEditID: "",
          commentForEditPostID: "",
          openForEdit: false
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteComment = async () => {
    // api/comments/:commentid/posts/:postid?username=:username
    try {
      const { commentForEditID, commentForEditPostID } = this.state;
      let response = await fetch(
        `http://localhost:9000/api/comments/${commentForEditID}/posts/${commentForEditPostID}?username=${this.props.userInfo.username}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + this.props.accessToken,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.ok) {
        this.setState({
          commentForEdit: "",
          commentForEditID: "",
          commentForEditPostID: "",
          openForEdit: false
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  postComment = async e => {
    e.preventDefault();
    if (localStorage.getItem("username")) {
      let comment = {
        comment: this.state.comment,
        postid: this.props.post._id
      };
      try {
        let response = await fetch(
          "http://localhost:9000/api/comments/" +
            this.props.post._id +
            "/" +
            localStorage.getItem("username"),
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
              "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
          }
        );
        comment = await response.json();
        if (response.ok) {
          this.setState({
            comments: [comment.newComment, ...this.state.comments],
            comment: ""
          });
          console.log(comment);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      toast.error("Login to comment the post!");
    }
  };

  capFirst = string => {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  };
}

export default withRouter(connect(mapStateToProps)(PostModal));
