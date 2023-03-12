import React, { Component } from 'react';
import { Container, Col, Row, Fade } from 'reactstrap'
import PostsList from './PostsList';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router-dom'
import EditInfoModal from './EditInfoModal';
import { connect } from 'react-redux'
import SideSection from './SideSection'

const mapStateToProps = state => state

class ProfilePage extends Component {
    state = {
        profile: undefined,
        posts: [],
        openEditInfo: false,
        updateIcons: false
    }
    render() {
        return (
            <div>
                {this.state.profile &&
                    <Fade>
                        <Container style={{ maxWidth: "800px" }}>
                            <Container className="profile">
                                <Row>
                                    <Col className="col-sm-4 col-md-3 col-l-2">
                                        <img className="profile-img" src={this.state.profile.image} alt="Profile Pic" />
                                    </Col>
                                    <Col>
                                        <div className="profile-info ml-1">
                                            <h3>{this.capFirst(this.state.profile.firstname) + " " + this.capFirst(this.state.profile.lastname)}</h3>
                                            <span className="mt-5">{this.state.profile.posts + " Posts " + this.state.profile.rating + " Ratings"}</span>
                                            <h6 style={{ color: "#666", marginTop: "0.5em" }}>{"@" + this.state.profile.username}</h6>
                                        </div>
                                        {this.props.match.params.username === localStorage.getItem("username") && <span className="icon" onClick={() => this.toggleEditInfo()}><FontAwesome name="edit" /></span>}
                                    </Col>
                                </Row>
                            </Container>
                            {this.state.openEditInfo && <EditInfoModal open={this.state.openEditInfo} toggle={this.toggleEditInfo} />}
                            {this.state.posts.length > 0
                                ?
                                <PostsList updateRates={(posts) => this.updateRatings(posts)} posts={this.state.posts} newrefresh={this.initialFetcher} posts={this.state.posts} updateIcons={this.state.updateIcons} section={"myposts"} />
                                :
                                <span className="center-msg">No Posts</span>
                            }
                        </Container>
                    </Fade>
                }
            </div>
        );
    }

    initialFetcher = async () => {
        try {
            let response = await fetch("http://localhost:9000/api/users/" + this.props.match.params.username)
            if (response.status === 500)
                this.props.history.push("/")
            let profile = await response.json()
            console.log(profile)
            response = await fetch("http://localhost:9000/api/posts/username/" + this.props.match.params.username)
            let posts = await response.json()
            posts.sort(function (a, b) { return b.ratings.length - a.ratings.length })
            this.setState({
                profile: profile,
                posts: posts
            })

            if (this.props.match.params.username === this.props.userInfo.username) {
                this.setState({
                    updateIcons: true
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount = async () => {
        await this.initialFetcher()
    }

    capFirst = string => {
        if (string)
            return string.charAt(0).toUpperCase() + string.slice(1)
    }

    componentDidUpdate = async (prevProps, prevStates) => {
        if (prevProps.match.params.username !== this.props.match.params.username)
            await this.initialFetcher()
    }

    toggleEditInfo = (update) => {
        this.setState({ openEditInfo: !this.state.openEditInfo })
        if (update !== undefined && update.firstname !== undefined && update.lastname !== undefined)
            this.setState({
                profile: {
                    ...this.state.profile,
                    firstname: update.firstname,
                    lastname: update.lastname,
                    image: update.image
                }
            })
    }

    updateRatings = (posts) => {
        this.setState({
            posts: posts.sort((a, b) => b.ratings.length - a.ratings.length)
        })
    }
}

export default connect(mapStateToProps)(ProfilePage);

