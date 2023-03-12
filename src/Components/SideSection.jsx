import React, { Component } from 'react';
import { Col, Row, Container } from 'reactstrap'
import { Link } from 'react-router-dom'

class SideSection extends Component {
    state = {
        posts: [],
        tags: [],
        users: []
    }
    render() {
        return (
            <div className="side-section">
                <h4>Most Viewed Posts</h4>
                {this.state.posts.length > 0 &&
                    this.state.posts.map((post, index) =>
                        <Row key={index} className="most-viewed-post">
                            <Col>
                                <Link to={"/post/" + post._id} className="mt-2 link-side-section">
                                    <h6>{post.title}</h6>
                                </Link>
                            </Col>
                            <Col className="col-3 number-view-side-section">
                                <h5>{post.views}</h5>
                            </Col>
                        </Row>)}
                <h4 className="mt-4">Top Rated Users</h4>
                {this.state.users.length > 0 &&
                    this.state.users.map((user, index) =>
                        <Row key={index} className="most-viewed-post">
                            <Col>
                                <Row>
                                <img width="30px" className="comment-pic" src={user.image} />
                                    <Link to={"/profile/" + user.username} className="mt-2 link-side-section">
                                        <span>{this.props.cap(user.firstname.toLowerCase()) + " " + this.props.cap(user.lastname.toLowerCase())}</span>
                                    </Link>
                                </Row>
                            </Col>
                            <Col className="col-3 number-view-side-section mt-2">
                                <h5>{user.rating}</h5>
                            </Col>
                        </Row>)}
                <h4 className="mt-4">Popular Hashtags</h4>
                <Row className="mx-auto">
                    {this.state.tags &&
                        this.state.tags.map((tag, index) => <span style={{ padding: "0.4em", fontSize: Math.floor(Math.random() * (20 - 15) + 15) }}><Link className="post-hashtag" to={"/tags/" + tag}>{"#" + tag}</Link></span>)}
                </Row>
            </div>);
    }

    componentDidMount = async () => {
        try {
            let response = await fetch("http://localhost:9000/api/posts/all")
            let posts = await response.json()
            response = await fetch("http://localhost:9000/api/users/")
            let users = await response.json()
            let tags = []
            posts.forEach(post => { if (post.tags[0]) tags.push(post.tags[0]) })
            console.log(tags)
            posts.sort((a, b) => b.views - a.views)
            users.sort((a, b) => b.rating - a.rating)
            this.setState({
                posts: posts.slice(0, 6),
                tags: tags,
                users: users.slice(0, 6)
            })
        } catch (e) {
            console.log(e)
        }
    }
}

export default SideSection;