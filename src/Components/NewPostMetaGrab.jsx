import React, { Component } from "react";
import { Row, Col, Input, Container, Button } from "reactstrap";
import { connect } from 'react-redux'
import { ReactTinyLink } from "react-tiny-link";
import CreatePost from "./CreatePost"
import { toast } from 'react-toastify'


const mapStateToProps = state => state

class NewPostMetaGrab extends Component {
  state = {
    link: "",
    showImage: false,
    urlMetaTags: [],
    openMainForm: false

  };

  render() {
    return (
      <>
        {!this.state.openMainForm &&
          <Col>
            <Container className="text-center">
              <Row>
                <Col>
                  {!this.state.showImage && !this.state.link.includes("http" || "www") &&
                    <h4 className="alert-url">Insert a valid url!</h4>
                  }

      
                  <Input
                     onClick={()=>this.setState({link: "http://www."})}
                    className="create-url"
                    type="url"
                    placeholder="Type in a URL... Start with http://"
                    value={this.state.link}
                    onChange={(e)=> this.isUrlValid(e)}
                  />
              
                </Col>
                {this.state.showImage && this.state.link &&
                  <Button onClick={() => this.handleMetaTag(this.state.link)} className="paste-button">Next</Button>}
              </Row>
            </Container>
            <Container className="text-center">
              {/* {this.state.showImage && this.state.link &&
                <>
                  <h4 className="m-5">Preview</h4>
                  <div className="not-clickable" onclick="return false">
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic={true}
                      maxLine={2}
                      minLine={1}
                      url={this.state.link}
                    />
                  </div>
                </>} */}

                {

                  this.state.showImage && this.state.link.includes("http" || "www") ?
                  <>
                  <h4 className="m-5">Preview</h4>
                  <div className="not-clickable" onclick="return false">
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic={true}
                      maxLine={2}
                      minLine={1}
                      url={this.state.link}
                    />
                  </div>
                </> : <div className="mt-5"><small className="mt-5">start with http:// to preview url</small></div>
                }
            </Container>
          </Col>}
        {this.state.openMainForm && (<CreatePost data={this.state.urlMetaTags} link={this.state.link} />)}
      </>);
  }

  componentDidMount = () => {
    if(!this.props.accessToken)
      this.props.history.push("/")
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ showImage: true });
  };


  isUrlValid = (e) => {
    let userInput = e.currentTarget.value
    let res = userInput.match(
      // /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    );
    if (res !== null) {
      this.setState({
        link: e.currentTarget.value,
        showImage: true
      })
     
    }
    else {
      this.setState({ showImage: false,link: e.currentTarget.value })
    }
  };

  handleMetaTag = async (url) => {
   
   try {
    
     // http://localhost:9000/api/metatag?url=https://www.youtube.com/watch?v=93p3LxR9xfM
     const response = await fetch(`http://localhost:9000/api/metatag?url=${url}`)
     if (response.ok) {
       const urlData = await response.json()
       console.log(urlData)
       this.setState({
         urlMetaTags: urlData.value,
         openMainForm: true
       })
     }

     else{
       let er = await response.json()
      toast.error(`${er.error}, start with http://`)
     }

   } catch (error) {
     console.log(error)
   }
   
   
   
  };

}

export default connect(mapStateToProps)(NewPostMetaGrab);
