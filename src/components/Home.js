import React from "react";
import Carousel from 'react-bootstrap/Carousel';
import Laptop from '../images/homeImages/laptop.jpg';
import Tablet from '../images/homeImages/tablet.jpg';
import Mobile from '../images/homeImages/mobiles.jpg';

function Home() {
    return (
        <Carousel fade>
            <Carousel.Item interval={800}>
                <img className="d-block w-100" src={Laptop} alt="First slide" />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={800}>
                <img className="d-block w-100" src={Tablet} alt="Second slide" />
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={800}>
                <img className="d-block w-100" src={Mobile} alt="Third slide" />
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Home;