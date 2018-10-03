import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class About extends Component {
    render() {
        return (
            <Container className="about-text">
                <h2>Your subtle companion.</h2>
                <p>
                    Feeling that the noise of the big city is too much for you to bear? Just turn on the sound and allow yourself to become engulfed in the tranquil sounds of nature. Whether you wish to feel as if you’re sitting near a fireplace under a cozy blanket, or that you’re meditating on a desolate sea shore as gusts of wind ruffle your hair, Monotones will be there to set the mood. With this ambient sound equalizer, not only will you be able to relax, but you will also increase your productivity, as you’re trying to concentrate on your work!
                </p>
            </Container>
        );
    }
};

export default About;