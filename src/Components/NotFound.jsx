import React, { Component } from 'react';
import { Container } from 'reactstrap';

class NotFound extends Component {
    render() {
        return (
            <div>
                <Container>
                    <div className="text-center">
                        <h3>404 Not Found </h3>
                        <p>Go back Home</p>
                    </div>
                </Container>
            </div>
        );
    }
}

export default NotFound;