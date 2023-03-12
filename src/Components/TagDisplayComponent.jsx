import React, { Component } from "react";
import { Fade, Container, Row, Col } from "reactstrap";
import PostsList from "./PostsList";
import { Link } from "react-router-dom";

class TagDisplayComponent extends Component {
  state = {
    posts: [],
    allTags: []
  };
  render() {
    return (
      <>
        {
          <Fade>
            <Container
              style={{
                maxWidth: "800px",
                marginTop: this.state.posts ? "1.5em" : "0.5em"
              }}
            >
              <Row className="row justify-content-end">
                <Col className=" col-lg-3  col-md-3  col-sm-4 ">
                  <Container>
                    {this.state.allTags.map((tag, i) => (
                      <span key={i}>
                        <Link className="post-hashtag" to={"/tags/" + tag}>
                          &nbsp;&nbsp;{"#" + tag} &nbsp;
                        </Link>
                      </span>
                    ))}
                  </Container>
                </Col>
              </Row>

              {(() => {
                if (!this.state.posts || this.state.posts > 0) {
                  return (
                    <span className="center-msg">
                      No Post with this #hashtag!
                    </span>
                  );
                } else {
                  return (
                    <PostsList
                      updateRates={posts => this.updateRatings(posts)}
                      posts={this.state.posts}
                      refresh={() => this.fetchPosts()}
                      section={"hashtag"}
                      tag={this.props.match.params.tag}
                    />
                  );
                }
              })()}

              {/* {!this.state.posts || this.state.posts.length > 0
                            ?
                            <PostsList updateRates={(posts) => this.updateRatings(posts)} posts={this.state.posts} refresh={() => this.fetchPosts()} section={"hashtag"} tag={this.props.match.params.tag}/>
                            :
                            <span className="center-msg">No Post with this #hashtag!</span>
                        } */}
            </Container>
          </Fade>
        }
      </>
    );
  }
  componentDidMount = async () => {
    // http://localhost:9000/api/posts/hastag/javascript
    try {
      const responce = await fetch(
        "http://localhost:9000/api/posts/hastag/all/tags"
      );
      if (responce.ok) {
        const tagJson = await responce.json();
        this.setState({
          allTags: tagJson.allTags
        });
      }

      await this.fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.match.params.tag !== this.props.match.params.tag) {
      await this.fetchPosts();
    }
  };


  fetchPosts = async () => {
    try {
      const tag = this.props.match.params.tag;
      let response = await fetch(
        `http://localhost:9000/api/posts/hastag/${tag}`
      );
      let newPosts = await response.json();

      this.setState({
        posts: newPosts
      });
    } catch (e) {
      console.log(e);
    }
  };

  updateRatings = posts => {
    this.setState({
      posts: posts.sort((a, b) => b.ratings.length - a.ratings.length)
    });
  };
}

export default TagDisplayComponent;
