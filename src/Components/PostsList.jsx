import React, { Component } from 'react';
import { Container, Col, Fade, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import Login from './Login';
import PostModal from './PostModal';
import FontAwesome from "react-fontawesome";
import { connect } from 'react-redux'
import Moment from "react-moment"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const mapStateToProps = state => state

class PostsList extends Component {
    state = {
        posts: [],
        postModal: false,
        selectedPost: undefined,
        dateSection: undefined,
        today: new Date().toISOString().substring(0, 10),
        yesterday: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substring(0, 10),
        title: undefined,
        openLogin: false,
        deleteModalIsOpen: false,
        postIdForDelete: ""
    }



    render() {
        return (
            <Fade>
                <Row>
                    {this.state.postIdForDelete && this.state.deleteModalIsOpen &&

                        <Modal isOpen={this.state.deleteModalIsOpen} toggle={this.toggleDelete} >
                            <ModalHeader toggle={this.toggleDelete}></ModalHeader>
                            <ModalBody>

                                Do you really want to Delete this post?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggleDelete}>Cancel</Button>
                                <Button color="danger" onClick={() => this.deletePost(this.state.postIdForDelete)}>Delete</Button>
                            </ModalFooter>
                        </Modal>
                    }
                    {this.state.postModal && <PostModal open={this.state.postModal} toggle={this.togglePostModal} post={this.state.selectedPost} refresh={this.props.refresh} rate={(post) => this.ratePost(post)} />}
                    {this.state.posts && this.state.posts.length > 0 &&
                        <Col>
                            <h2>{this.state.title}</h2>
                            {this.state.posts.map((post, index) =>
                                <div key={index}>
                                    <Container className="m-4 mx-auto post " onClick={() => { this.setState({ selectedPost: post }); this.togglePostModal() }} >
                                        <Row>
                                            <div className="m-2">
                                                <img className="post-image" src={post.image} alt="Post Default Pic" />
                                            </div>
                                            <Col className="col-6">
                                                <Row className="mb-2">
                                                    <h4>{post.title.toUpperCase()}</h4>
                                                </Row>
                                                <Row>
                                                    <h5 style={{ color: "#8c8c8c" }}>{post.description}</h5>
                                                </Row>
                                                <Row>
                                                    <div className="details-post">
                                                        <FontAwesome name="comment" />
                                                        <span className="m-1">{post.commentsCount}</span>
                                                    </div>
                                                    <div className="details-post">
                                                        <span>
                                                            {post.category == "Tech" &&
                                                                <FontAwesome className="mr-1" name="laptop" />}
                                                            {post.category == "Sales" &&
                                                                <FontAwesome className="mr-1" name="chart-bar" />}
                                                            {post.category}
                                                        </span>
                                                    </div>
                                                    <div className="details-post">
                                                        <span>
                                                            {post.difficulty == "Medium" &&
                                                                <FontAwesome name="dot-circle" />}
                                                            {post.difficulty == "Hard" &&
                                                                <>
                                                                    <FontAwesome name="dot-circle" />
                                                                    <FontAwesome name="dot-circle" />
                                                                </>}
                                                            <FontAwesome className="mr-1" name="dot-circle" />
                                                            {post.difficulty}
                                                        </span>
                                                    </div>
                                                    {this.props.updateIcons &&
                                                        <div className="details-post">
                                                            <Col>  
                                                            <span onClick={(e) => {e.stopPropagation(); this.setState({postIdForDelete: post._id, deleteModalIsOpen: true })}} ><FontAwesome className="mr-1" name="trash" />Delete</span>
                                                                &nbsp; &nbsp;
                                                            <Link to={"/editpost/" + post._id}><span><FontAwesome className="mr-1" name="edit" />Edit</span></Link>
                                                            </Col>
                                                        </div>}
                                                </Row>
                                                <Row>
                                                    {post.tags.length > 0 &&
                                                        post.tags.map((tag, i) =>
                                                            <span key={i}>
                                                                <Link className="post-hashtag" to={"/tags/" + tag}>&nbsp;{"#" + tag} &nbsp;</Link>
                                                            </span>
                                                        )}
                                                </Row>
                                                <Row>
                                                    <h6 style={{ fontSize: "medium", paddingTop: "0.5em" }}>Posted By <Link className="post-username" to={"/profile/" + post.username}>{"@" + post.username}</Link></h6>
                                                </Row>
                                                <Row>
                                                    <h6 style={{ fontStyle: "italic", fontSize: "small" }}><Moment fromNow>{post.createdAt}</Moment></h6>
                                                </Row>
                                            </Col>
                                            <Col className="p-0">
                                                {post.ratings.length > 0 && post.ratings.find(({ upvotedBy }) => upvotedBy === this.props.userInfo.username)
                                                    ?
                                                    <span onClick={(e) => this.ratePost(post, e)} className="rate2">
                                                        <FontAwesome className="rate2-color" name="star" size="2x" />
                                                        <span className="rate-number">{post.ratingsCount}</span>
                                                    </span>
                                                    :
                                                    <span onClick={(e) => this.ratePost(post, e)} className="rate">
                                                        <FontAwesome className="rate-color" name="star" size="2x" />
                                                        <span className="rate-number">{post.ratingsCount}</span>
                                                    </span>
                                                }
                                            </Col>

                                        </Row>
                                    </Container>
                                </div>
                            )}
                        </Col>}
                </Row>
                {!this.props.userInfo.accessToken && this.state.openLogin && <Login toggle={() => this.setState({ openLogin: !this.state.openLogin })} open={this.state.openLogin} />}
            </Fade >
        );
    }

    componentDidMount = () => {
        if (this.props.posts.length > 0) {
            this.filterPosts(this.props.posts)
            console.log("mount IF")
        }
        console.log("mount NOT IF")
    }

    componentDidUpdate = (prevProps, prevStates) => {
        if (this.props.posts !== prevProps.posts || prevStates.posts.length !== this.state.posts.length) {
            this.filterPosts(this.props.posts)
            console.log("update IF")
        }
        console.log("update NOT IF")
    }

    checkUserRate = (post) => {
        let result = post.ratings.filter(post => post.upvotedBy === this.props.userInfo.username)
        console.log(result)
    }

    ratePost = async (post, e) => {
        if (e)
            e.stopPropagation()
        if (this.props.accessToken && this.props.userInfo.username) {
            let allPosts = this.props.posts
            console.log(allPosts)
            let ratingsFind = post.ratings.find(({ upvotedBy }) => upvotedBy === this.props.userInfo.username)
            console.log(ratingsFind)
            if (ratingsFind !== undefined) {
                try {
                    console.log("UNRATED")
                    var indexOfThePost = 0
                    var indexOfRating = 0
                    this.props.posts.forEach((singlePost, index) => {
                        if (singlePost._id == post._id)
                            indexOfThePost = index
                    })
                    allPosts[indexOfThePost].ratings.forEach((singleRating, index) => {
                        if (singleRating.upvotedBy == this.props.userInfo.username)
                            indexOfRating = index
                    })
                    allPosts[indexOfThePost].ratingsCount--
                    allPosts[indexOfThePost].ratings.splice(indexOfRating, 1)
                    this.props.updateRates(allPosts)
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
                    var indexOfThePost = 0
                    this.props.posts.forEach((singlePost, index) => {
                        if (singlePost._id == post._id)
                            indexOfThePost = index
                    })
                    allPosts[indexOfThePost].ratingsCount++
                    let userUpRate = {
                        upvotedBy: this.props.userInfo.username
                    }
                    allPosts[indexOfThePost].ratings.push(userUpRate)
                    this.props.updateRates(allPosts)
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


    filterPosts = (postsList) => {
        switch (this.props.section) {
            case "today": {
                let posts = postsList.filter(post => post.createdAt.substring(0, 10) === this.state.today)
                this.setState({
                    posts: posts,
                    title: "Today"
                })
            } break;
            case "yesterday": {
                let posts = postsList.filter(post => post.createdAt.substring(0, 10) === this.state.yesterday)
                this.setState({
                    posts: posts,
                    title: "Yesterday"
                })
            } break;
            case "hashtag": {
                this.setState({
                    posts: postsList,
                    title: "#" + this.props.tag
                })
            } break;

            case "myposts": {
                this.setState({
                    posts: postsList,
                    title: "My Post List"
                })
            } break;

            default: {
                let posts = postsList.filter(post => post.createdAt.substring(0, 10) < this.state.yesterday)
                console.log(posts)
                this.setState({
                    posts: posts,
                    title: "Older Posts"
                })
            } break;
        }
    }

    togglePostModal = () => {
        this.setState({
            postModal: !this.state.postModal
        })
    }

    toggleDelete = () => {
        this.setState({
            deleteModalIsOpen: !this.state.deleteModalIsOpen,
            postIdForDelete: ""
        })
    }


    deletePost = async (id) => {
        // api/posts/:username/:id

        try {

            const resp = await fetch(
                `http://localhost:9000/api/posts/${this.props.userInfo.username}/${id}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + this.props.accessToken,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (resp.ok) {
                this.toggleDelete()
                this.props.newrefresh()
                toast.success(`Post successfully deleted`)
            }

        } catch (error) {
            console.log(error)
        }
    }
}
export default connect(mapStateToProps)(PostsList);