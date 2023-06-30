import { Card, Container } from 'react-bootstrap';

const About = () => {
    return (
        <Container>
            <Card className='aboutUs'>
                <Card.Body>
                    <Card.Title>
                        <h1 className='text-center'>About Us</h1>
                    </Card.Title>
                    <Card.Text>
                        Welcome to our e-commerce website! We are dedicated to providing high-quality products and exceptional shopping experiences to our customers.
                    </Card.Text>

                    <Card.Title>Our Mission</Card.Title>
                    <Card.Text>
                        At our company, our mission is to deliver the best online shopping experience by offering a wide range of products, competitive prices, and excellent customer service. We strive to make your shopping journey convenient, enjoyable, and satisfying.
                    </Card.Text>

                    <Card.Title>Our Values</Card.Title>
                    <Card.Text as='div'>
                        <ul>
                            <li>Customer Satisfaction: We prioritize the satisfaction of our customers and aim to exceed their expectations.</li>
                            <li>Product Quality: We carefully select and curate products that meet our high-quality standards.</li>
                            <li>Reliability: We ensure a secure and reliable shopping experience, from browsing products to making payments and receiving orders.</li>
                            <li>Innovation: We embrace technological advancements and continuously improve our website to provide the best user experience.</li>
                            <li>Transparency: We believe in open and honest communication with our customers, partners, and stakeholders.</li>
                        </ul>
                    </Card.Text>

                    <Card.Title>Get in Touch</Card.Title>
                    <Card.Text as='div'>
                        If you have any questions, feedback, or inquiries, we would love to hear from you. Feel free to contact our customer support team through the provided channels:
                        <ul>
                            <li>Email: shubhamsaini5878@gmail.com</li>
                            <li>Phone: 123-456-7890</li>
                            <li>
                                Follow us on social media:
                                <div className='d-inline-flex flex-wrap'>
                                    <i className='fa fa-instagram' style={{ margin: '10px' }}></i>
                                    <i className='fa fa-facebook' style={{ margin: '10px' }}></i>
                                    <i className='fa fa-whatsapp' style={{ margin: '10px' }}></i>
                                    <i className='fa fa-twitter' style={{ margin: '10px' }}></i>
                                    <i className='fa fa-youtube-play' style={{ margin: '10px' }}></i>
                                </div>
                            </li>
                        </ul>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default About;