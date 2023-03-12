import React, { Component } from 'react';
import { Button, Fade, Row, Container, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { toast } from 'react-toastify'
import Moment from "react-moment"
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton
} from "react-share";
import {
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon
} from "react-share";
import ReplyComponent from './CommentComponent';
import CommentComponent from './CommentComponent';



const mapStateToProps = state => state

class SinglePostPage extends Component {
    state = {
        post: undefined,
        comments: [],
        commentLoading: true,
        comment: "",
        openForEdit: false,
        commentForEdit: "",
        commentForEditID: "",
        commentForEditPostID: "",
        videoPlayer: true,
        shareUrl: undefined,
        shareTitle: undefined
    }

    render() {
        return (
            <div className="w-50 mx-auto">
                {this.state.post &&
                    <div>
                        <Container className=" mt-5">
                            <Row>
                                <Col>
                                    <Row>
                                        <img className="modal-image" src={this.state.post.image} />
                                        <Col>
                                            <h4 className="m-2">{this.state.post.title.toUpperCase()}</h4>
                                            <a href={this.state.post.link}><Button className="m-2">View Link</Button></a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h5 className="m-3">{this.state.post.description}</h5>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="col-3">
                                    <Row>
                                        <Col>
                                            {this.state.post.ratings.length > 0 && this.state.post.ratings.find(({ upvotedBy }) => upvotedBy === this.props.userInfo.username)
                                                ?
                                                <span onClick={() => this.ratePost(this.state.post)} className="rate2 mr-0">
                                                    <FontAwesome name="star" size="2x" />
                                                    <span className="rate-number">{this.state.post.ratingsCount}</span>
                                                </span>
                                                :
                                                <span onClick={() => this.ratePost(this.state.post)} className="rate mr-0">
                                                    <FontAwesome name="star" size="2x" />
                                                    <span className="rate-number">{this.state.post.ratingsCount}</span>
                                                </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="details-post">
                                            <h6>
                                                <FontAwesome name="comment" />
                                                <span className="m-1">{this.state.post.commentsCount}</span>
                                            </h6>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="details-post">
                                            <h6>
                                                {this.state.post.category == "Tech" &&
                                                    <FontAwesome className="mr-1" name="laptop" />}
                                                {this.state.post.category == "Sales" &&
                                                    <FontAwesome className="mr-1" name="chart-bar" />}
                                                {this.state.post.category}
                                            </h6>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="details-post">
                                            <h6>
                                                {this.state.post.difficulty == "Medium" &&
                                                    <FontAwesome name="dot-circle" />}
                                                {this.state.post.difficulty == "Hard" &&
                                                    <>
                                                        <FontAwesome name="dot-circle" />
                                                        <FontAwesome name="dot-circle" />
                                                    </>}
                                                <FontAwesome className="mr-1" name="dot-circle" />
                                                {this.state.post.difficulty}
                                            </h6>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="p-4">
                                {this.state.videoPlayer && <ReactPlayer url={this.state.post.link} onError={() => this.setState({ videoPlayer: false })} />}
                            </Row>
                            <Row>
                                <Col className="mt-2 ml-4 ">
                                    <Row>
                                        <h6 style={{ fontSize: "medium", paddingTop: "0.5em" }}>Posted By <Link className="post-username" to={"/profile/" + this.state.post.username}>{"@" + this.state.post.username}</Link></h6>
                                    </Row>
                                    <Row>
                                        <h6 style={{ fontStyle: "italic", fontSize: "small" }}><Moment fromNow>{this.state.post.createdAt}</Moment></h6>
                                    </Row>
                                </Col>
                                <Col className="m-2">
                                    <Container className="text-right">
                                        <h5 className="mr-4">Share it on:</h5>
                                        <ul className="social-share list-unstyled list-inline">
                                            <li className="list-inline-item">
                                                <FacebookShareButton
                                                    url={this.state.shareUrl}
                                                    quote={this.state.shareTitle}
                                                    className="button"
                                                >
                                                    <FacebookIcon
                                                        size={32}
                                                        round={true} />
                                                </FacebookShareButton>
                                            </li>
                                            <li className="list-inline-item">
                                                <TwitterShareButton
                                                    url={this.state.shareUrl}
                                                    title={this.state.shareTitle}
                                                    className="button">
                                                    <TwitterIcon
                                                        size={32}
                                                        round={true} />
                                                </TwitterShareButton>
                                            </li>
                                            <li className="list-inline-item">
                                                <LinkedinShareButton
                                                    url={this.state.shareUrl}
                                                    title={this.state.shareTitle}
                                                    windowWidth={750}
                                                    windowHeight={600}
                                                    className="button">
                                                    <LinkedinIcon
                                                        size={32}
                                                        round={true} />
                                                </LinkedinShareButton>
                                            </li>
                                        </ul>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                        <Container >
                            <Form onSubmit={this.postComment}>
                                <Col>
                                    <FormGroup>
                                        {this.props.userInfo.username &&
                                            <>
                                                <img className="comment-pic mr-3 p-2 " src={this.props.userInfo.image} style={{ maxHeight: "40px", maxWidth: "40px" }} alt=" profile" />
                                                <Label className="font-weight-bold">{this.capFirst(this.props.userInfo.firstname) + " " + this.capFirst(this.props.userInfo.lastname)}</Label>
                                            </>}
                                        <Input className="rounded-pill" type="text" onChange={(e) => this.setState({ comment: e.target.value })} value={this.state.comment} placeholder="Comment this post" />
                                    </FormGroup>
                                    <Button className="btn-modal-primary rounded-pill">Comment</Button>
                                </Col>
                            </Form> 
                        </Container>
                {/*<------------------- comment section -------------------> */}

                        {/* {this.state.comments && !this.state.commentLoading && this.state.comments.map((comment, index) =>
                            <Container className="section-modal" key={index}>
                                {this.props.userInfo.username === comment.userInfo.username && !this.state.openForEdit && <div className="penBg float-right" onClick={() => this.setState({ openForEdit: true, commentForEdit: comment.comment, commentForEditID: comment._id, commentForEditPostID: comment.postid })}><FontAwesome name="pen" className=" penEdit" /></div>
                                }
                                <Row>
                                    <img className="comment-pic" src={comment.userInfo.image} />
                                    {this.state.commentForEditID !== comment._id &&
                                        <Col>
                                            <Row>
                                                <h5 className="font-weight-bold"><Link className="comment-name" to={"/profile/" + comment.userInfo.username}>{this.capFirst(comment.userInfo.firstname) + " " + this.capFirst(comment.userInfo.lastname)}</Link></h5>
                                            </Row>
                                            <Row>
                                                <h6 className="mt-3 mb-3">{comment.comment}</h6>
                                            </Row>
                                            <Row>
                                                <h6 style={{ fontStyle: "italic", fontSize: "small" }}><Moment fromNow>{comment.createdAt}</Moment></h6>
                                            </Row>
                                        </Col>}
                                    {this.state.openForEdit && this.state.commentForEditID === comment._id && <Col>
                                        <button type="button" className="close" aria-label="Close" onClick={() => this.setState({ openForEdit: false, commentForEditID: "", commentForEditPostID: "" })}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <FormGroup >
                                            <Label>Edit this comment:</Label>
                                            <Input type="textarea" onChange={(e) => this.setState({ commentForEdit: e.target.value })} value={this.state.commentForEdit} />
                                        </FormGroup>
                                        <Row>
                                            <Button className="btn-modal-primary m-3" onClick={this.updateComment}>Update</Button>
                                            <Button onClick={this.deleteComment}>Delete</Button>
                                        </Row>
                                    </Col>}

                                   
                                </Row>
                                
                            </Container>

                               

                        )} */}


                    </div>}

                    <Container className="mt-5"> <CommentComponent  refresh={()=> this.refresh()} comments={this.state.comments}/></Container>
            </div>
        );
    }

    refresh=async ()=>{
        await this.getAllComments()

    }

    componentDidMount = async () => {
        await this.fetchPost()
        await this.getAllComments()

        console.log(this.state.post._id)
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.openForEdit !== this.state.openForEdit || prevProps.match.params.id !== this.props.match.params.id) {
  
            await this.fetchPost()
            await this.getAllComments()
        }

      

    }

    getAllComments = async () => {
        try {
            let response = await fetch(`http://localhost:9000/api/comments/${this.state.post._id}?sort=updatedAt`)
            let comments = await response.json()
            //    let sortedComments = comments.sort((a,b) =>b.createdAt - a.createdAt)
            this.setState({
                comments: comments.reverse()
            })
            console.log(this.state.comments)
            setTimeout(() => {
                this.setState({
                    commentLoading: false
                })
            }, 500);
        } catch (e) {
            console.log(e)
        }
    }

    updateComment = async () => {
        //    /api/comments/:postid/:username/:commentid
        // commentForEdit:"",
        // commentForEditID:"",
        //commentForEditPostID:""
        try {
            const { commentForEdit, commentForEditID, commentForEditPostID } = this.state
            let bodyForPUT = { comment: commentForEdit }
            let response = await fetch(`http://localhost:9000/api/comments/${commentForEditPostID}/${this.props.userInfo.username}/${commentForEditID}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + this.props.accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyForPUT)
            })
            if (response.ok) {
                this.setState({
                    commentForEdit: "",
                    commentForEditID: "",
                    commentForEditPostID: "",
                    openForEdit: false
                })
            }
        } catch (error) {
            console.log(error)
        }
    };

    deleteComment = async () => {
        // api/comments/:commentid/posts/:postid?username=:username
        try {
            const { commentForEditID, commentForEditPostID } = this.state
            let response = await fetch(`http://localhost:9000/api/comments/${commentForEditID}/posts/${commentForEditPostID}?username=${this.props.userInfo.username}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + this.props.accessToken,
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                this.setState({
                    commentForEdit: "",
                    commentForEditID: "",
                    commentForEditPostID: "",
                    openForEdit: false
                })
            }
        } catch (error) {
            console.log(error)
        }
    };

    fetchPost = async () => {
        try {
            console.log("HEREEE")
            let response = await fetch("http://localhost:9000/api/posts/" + this.props.match.params.id)
            let post = await response.json()
            this.setState({
                post: post,
                shareUrl: window.location.href + "post/" + post._id,
                shareTitle: post.title
            })
        } catch (e) {
            console.log(e)
        }
    }

    postComment = async (e) => {
        e.preventDefault()
        if (localStorage.getItem("username")) {
            let comment = {
                comment: this.state.comment,
                postid: this.state.post._id
            }
            try {
                let response = await fetch("http://localhost:9000/api/comments/" + this.state.post._id + "/" + localStorage.getItem("username"), {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(comment)
                })
                comment = await response.json()
                if (response.ok) {
                    this.setState({
                        comments: [
                            comment.newComment, ...this.state.comments
                        ],
                        comment: ""
                    })
                    console.log(comment)
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            toast.error("Login to comment the post!")
        }
    }

    ratePost = async (post, e) => {
        if (e)
            e.stopPropagation()
        if (this.props.accessToken && this.props.userInfo.username) {
            let ratingsFind = this.state.post.ratings.find(({ upvotedBy }) => upvotedBy === this.props.userInfo.username)
            if (ratingsFind !== undefined) {
                try {
                    let indexOfRating = 0
                    this.state.post.ratings.forEach((singleRating, index) => {
                        if (singleRating.upvotedBy == this.props.userInfo.username)
                            indexOfRating = index
                    })
                    let post = this.state.post
                    post.ratingsCount--
                    post.ratings.splice(indexOfRating, 1)
                    this.setState({
                        post: post
                    })
                    await fetch(
                        `http://localhost:9000/api/ratings/${
                        post._id
                        }/${this.props.userInfo.username}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer " + this.props.accessToken,
                                "Content-Type": "application/json"
                            }
                        }
                    );
                } catch (e) {
                    console.log(e)
                }
            } else {
                try {
                    console.log("RATED")
                    let post = this.state.post
                    post.ratingsCount++
                    let userUpRate = {
                        upvotedBy: this.props.userInfo.username
                    }
                    post.ratings.push(userUpRate)
                    this.setState({
                        post: post
                    })
                    await fetch(
                        `http://localhost:9000/api/ratings/${
                        post._id
                        }/${this.props.userInfo.username}`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer " + this.props.accessToken,
                                "Content-Type": "application/json"
                            }
                        }
                    );
                } catch (e) {
                    console.log(e)
                }
            }
        } else {
            this.setState({
                openLogin: true
            })
        }
    }

    capFirst = string => {
        if (string)
            return string.charAt(0).toUpperCase() + string.slice(1)
    }
}

export default withRouter(connect(mapStateToProps)(SinglePostPage));