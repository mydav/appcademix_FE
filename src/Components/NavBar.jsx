import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    NavItem,
    Nav,
    Button,
    Fade,
    Input,
    Collapse,
    Row,
    Col,
    NavbarToggler
} from 'reactstrap';
import { toast } from 'react-toastify'
import { NavLink, Link } from 'react-router-dom'
import Login from './Login'
import RubberBand from 'react-reveal/RubberBand';
import { connect } from "react-redux"
import { getUsersWithThunk } from '../Actions/setUser'
import PostModal from './PostModal'
import DarkModeToggle from './DarkModeToggle';

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
    loadUsers: (userInfos, t) => dispatch(getUsersWithThunk(userInfos, t))
})

class NavBar extends Component {
    state = {
        loginModal: false,
        search: "",
        searchOpen: false,
        allPosts: [],
        postsFiltered: [],
        usersFiltered: [],
        allUsers: [],
        collapsed: true
    }

    render() {
        return (
            <>
                <Navbar>
                    <NavbarBrand href="/">
                        <RubberBand>
                            <img width="40px" src="https://i.postimg.cc/BnCc3QGK/Appaccademix-Logo-Magenta.png" />
                        </RubberBand>
                    </NavbarBrand>
                        <Nav className="mr-auto" >
                            <NavItem>
                                <Input placeholder="Search users, posts..." className="search-bar" type="text" value={this.state.search} onChange={(e) => this.searchFilter(e.target.value)} />
                                {this.state.searchOpen && <Collapse isOpen={this.state.searchOpen}>
                                    <h4>USERS</h4>
                                    {this.state.usersFiltered.length > 0
                                        ?
                                        this.state.usersFiltered.slice(0, 5).map((user, index) =>
                                            <Link to={"/profile/" + user.username} key={index}>
                                                <Row className="search-result m-2" onClick={() => this.setState({ searchOpen: false, search: "" })}>
                                                    <img className="user-pic" src={user.image} />
                                                    <span>{user.firstname + " " + user.lastname} </span>
                                                </Row>
                                            </Link>
                                        )
                                        :
                                        <h5 className="m-5">No User Found</h5>
                                    }
                                    <h4>POSTS</h4>
                                    {this.state.postsFiltered.length > 0
                                        ?
                                        this.state.postsFiltered.slice(0, 5).map((post, index) =>
                                            <Link to={"/post/" + post._id} key={index}>
                                                <Row className="search-result m-2" onClick={() => this.setState({ searchOpen: false, search: "" })}>
                                                    <img className="user-pic" src={post.image} />
                                                    <Col>
                                                        <h5>{post.title} </h5>
                                                        <span>{post.description} </span>
                                                    </Col>
                                                </Row>
                                            </Link>)
                                        :
                                        <h5 className="m-5">No Post Found</h5>
                                    }
                                </Collapse>}
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                            </NavItem>
                            {this.props.accessToken && localStorage.getItem("access_token") !== "" &&
                                <>
                                    <NavItem>
                                        <NavLink className="nav-link" to={"/profile/" + localStorage.getItem("username")}>Profile</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className="nav-link" to={"/createpost"}>Create Post</NavLink>
                                    </NavItem>
                                </>
                            }
                        </Nav>
                        <DarkModeToggle />
                        {!this.props.accessToken || localStorage.getItem("access_token") === ""
                            ?
                            <>
                                <Button onClick={this.toggleLoginModal}>Log In</Button>
                                <Link to="/register"><Button className="ml-2 btn-modal-primary">Register</Button></Link>
                            </>
                            : <Button onClick={this.toggleLogout}>Sign Out</Button>}
                </Navbar>
                {this.state.searchOpen &&
                    <div onClick={() => this.setState({ searchOpen: false })} className="background-layer">
                    </div>
                }
                {this.state.loginModal && <Login toggle={this.toggleLoginModal} open={this.state.loginModal} />}

            </>
        );
    }

    toggleLoginModal = () => this.setState({ loginModal: !this.state.loginModal })

    toggleLogout = () => {
        localStorage.removeItem("username")
        localStorage.removeItem("access_token")
        this.props.loadUsers("", "")
        this.setState({})
        toast.success(`Good bye`)
    }

    componentDidMount = async () => {
        try {
            let responseUsers = await fetch("http://localhost:9000/api/users")
            let users = await responseUsers.json()
            let responsePosts = await fetch("http://localhost:9000/api/posts/all")
            let posts = await responsePosts.json()
            if (responseUsers.ok || responsePosts.ok) {
                this.setState({
                    allPosts: posts,
                    allUsers: users
                })
            } else {
                console.log("error fetching posts/users", responsePosts, responseUsers)
            }
        } catch (e) {
            console.log(e)
        }
    }

    searchFilter = search => {
        if (search && search.length > 0) {
            try {
                this.setState({
                    search: search,
                    searchOpen: true
                })
                this.setState({
                    usersFiltered: this.state.allUsers.filter(user =>
                        user.firstname.toUpperCase().includes(search.toUpperCase()) ||
                        user.lastname.toUpperCase().includes(search.toUpperCase())),
                    postsFiltered: this.state.allPosts.filter(post =>
                        post.title.toUpperCase().includes(search.toUpperCase()) ||
                        post.description.toUpperCase().includes(search.toUpperCase()))
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            this.setState({
                search: "",
                searchOpen: false
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
