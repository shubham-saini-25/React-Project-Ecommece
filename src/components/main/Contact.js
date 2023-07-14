import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Container } from "react-bootstrap";
import contactImg from '../../images/homeImages/contact.png';
import { ToastContainer, toast } from 'react-toastify';
import { sendContactEmail } from '../../Api/Email';

function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formBtnStatus, setFormBtnStatus] = useState('Send');

    const validateContactForm = () => {
        return name.length > 0 && email.length > 0 && message.length > 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormBtnStatus('Sending...');

        const data = { name, email, message };

        try {
            const response = await sendContactEmail(data);
            if (response) {
                toast.success(response.message);
                setFormBtnStatus('Send');
                setName("");
                setEmail("");
                setMessage("");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    }

    return (
        <Container id="Contact">
            <ToastContainer />
            <Card className='contactUs'>
                <Card.Header>
                    <h1 className="text-center mt-2">Contact Us</h1>
                </Card.Header>
                <Card.Body>
                    <Row className='d-flex justify-content-center'>
                        <Col md={5} className='contactUsImgBox'>
                            <Card.Img src={contactImg} alt='Contact-Me' className='contactImg' />
                        </Col>

                        <Col md={6} className='mt-2'>
                            <Form className="p-3 mt-3" autoComplete='off' onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input className="form-control" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className="form-control" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <label className="form-label" htmlFor="message">Message</label>
                                    <textarea className="form-control" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required style={{ height: '85px' }} />
                                </Form.Group>

                                <div className='text-center'>
                                    <Button type="submit" className='mt-2' disabled={!validateContactForm()}>{formBtnStatus}</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <div className='socialIcons'>
                        <i className='fa fa-instagram fa-2x'></i>
                        <i className='fa fa-facebook fa-2x'></i>
                        <i className='fa fa-whatsapp fa-2x'></i>
                        <i className='fa fa-twitter fa-2x'></i>
                        <i className='fa fa-youtube-play fa-2x'></i>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ContactForm;