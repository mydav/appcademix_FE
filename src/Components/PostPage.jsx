import React, { Component } from 'react';
import PostsList from './PostsList';
import { toast } from 'react-toastify'
import { Fade, Row, Col, Container, Input, Button } from 'reactstrap';
import FilterComponent from './FilterComponent';
import FilterCategory from './FilterCategory';
import { connect } from "react-redux"
import { refreshTokenAPI } from "../API/refresh"
import { getUsersWithThunk } from '../Actions/setUser'
import SideSection from './SideSection';

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
    loadUsers: (userInfos, token) => dispatch(getUsersWithThunk(userInfos, token))
})

class PostPage extends Component {
    state = {
        posts: [],
        filteredPosts: []
    }
    render() {
        return (
            <Fade>
                <Container fluid className="mt-5">
                    <Row>
                        <div className="col-sm-12 col-md-3 col-lg-3 ml-5">
                            <div className="filters">
                            <Row className="mb-3">
                                <FilterComponent filter={this.filterby} />
                            </Row>
                            <Row className="mb-5" >
                                <FilterCategory filter={this.filterbycategory} />
                            </Row>
                            </div>
                        </div>
                        <Col className="posts-section">
                            {this.state.posts.length > 0 &&
                                <>
                                    <PostsList updateRates={(posts) => this.updateRatings(posts)} posts={this.state.filteredPosts} refresh={() => this.fetchPosts()} section={"today"} />
                                    <PostsList updateRates={(posts) => this.updateRatings(posts)} posts={this.state.filteredPosts} refresh={() => this.fetchPosts()} section={"yesterday"} />
                                    <PostsList updateRates={(posts) => this.updateRatings(posts)} posts={this.state.filteredPosts} refresh={() => this.fetchPosts()} />
                                </>}
                        </Col>
                        <Col className="col-sm-4 col-md-3 col-lg-3  d-none d-md-block" >
                            <SideSection cap={(str) => this.capFirst(str)}/>
                        </Col>
                    </Row>
                </Container>
            </Fade>)}
            
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.accessToken !== this.props.accessToken) {
            await this.filterby()
            console.log("POST UPDATED")
        }
    }

    componentDidMount = async () => {
        let search = new URLSearchParams(this.props.location.search)
        const access_token = search.get("token")
        const userName = search.get("username")
        if (access_token && userName) {
            const userJson = await refreshTokenAPI(access_token);
            this.props.loadUsers(userJson.userInfo, userJson.access_token)
            localStorage.setItem("access_token", userJson.access_token)
            localStorage.setItem("username", userJson.userInfo.username)
            toast.success(`Welcome ${userJson.userInfo.firstname}`)
            this.props.history.push("/")
        }
        await this.filterby()
    }

    filterby = async (params) => {
        try {
            if (params) {
                let response = await fetch(`http://localhost:9000/api/posts?sort=${params}&number=1`)
                let posts = await response.json()
                const newPost = posts.postsList
                this.setState({
                    posts: newPost,
                    filteredPosts: newPost
                })
            }
            else {
                await this.fetchPosts()
                console.log("no params so ran the fetchpost")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    filterbycategory = (param) => {
        if (param) {
            try {
                let posts = this.state.posts.filter(post => post.category == this.capFirst(param))
                console.log(posts)
                this.setState({
                    filteredPosts: posts
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            this.setState({
                filteredPosts: this.state.posts
            })
        }
    }

    capFirst = string => {
        if (string)
            return string.charAt(0).toUpperCase() + string.slice(1)
    }


    fetchPosts = async () => {
        try {
            let response = await fetch("http://localhost:9000/api/posts?sort=ratingsCount")
            let posts = await response.json()
            console.log("all posts", posts)
            const newPosts = posts.postsList
            this.setState({
                posts: newPosts,
                filteredPosts: newPosts
            })
        } catch (e) {
            console.log(e)
        }
    }

    updateRatings = (posts) => {
        this.setState({
            posts: posts.sort((a, b) => b.ratings.length - a.ratings.length)
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);