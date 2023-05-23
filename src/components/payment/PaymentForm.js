import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import { useCart } from "react-use-cart";
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';

const PaymentForm = (props) => {
    const { items, cartTotal } = useCart();
    const totalAmount = (cartTotal + props.shippingCharges).toFixed(2);
    const [payBtnText, setPayBtnText] = useState('Make Payment');
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const elements = useElements();
    const stripe = useStripe();

    const addressOptions = {
        mode: 'shipping',
        allowedCountries: ['US'],
        fields: {
            phone: 'always',
        },
        validation: {
            phone: {
                required: 'always',
            },
        },
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        if (isValidEmail && email.length > 0) {
            setEmailError('');
        } else {
            setEmailError('Please enter a valid email');
        }

        localStorage.setItem('cartItems', JSON.stringify(items));
        localStorage.setItem('cartTotal', cartTotal);
        setPayBtnText(<i className="fa fa-spinner fa-spin"></i>);
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/payment-invoice',
                receipt_email: email,
            },
        });

        if (result.error) {
            console.error(result.error);
            toast.error(result.error.message);
            setPayBtnText('Make Payment');
        }
    };

    return (
        <>
            <Modal.Body>
                <ToastContainer />
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Card className="text-dark rounded-3 h-100">
                        <Card.Header>
                            <div className="text-center">
                                <h5>Shipping and Payment details</h5>
                                <img src="http://surl.li/gwolo" width={150} alt="cardsImg"></img>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" style={{ marginTop: '-3px' }}>
                                        <Form.Label style={{ fontSize: '15px' }}>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter your email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            style={{ marginTop: '-5px', height: '45px', border: emailError ? '2px solid red' : '1px solid #e6e6e6' }} />
                                        {emailError && <div className="text-danger" style={{ fontSize: '15px' }}>
                                            {emailError}
                                        </div>}
                                    </Form.Group>

                                    <AddressElement options={addressOptions} />
                                </Col>
                                <Col md={6}>
                                    <PaymentElement className="mt-1" />
                                    <hr />
                                    <div className='table-responsive text-center mt-3'>
                                        <table className="table table-bordered border-light">
                                            <thead>
                                                <tr>
                                                    <td>Sub Total:</td>
                                                    <td>${cartTotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping:</td>
                                                    <td>{props.shippingCharges > 0 ? `$${props.shippingCharges.toFixed(2)}` : 'Free'}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total:</th>
                                                    <th>${totalAmount}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button type='submit' disabled={!stripe} className='btn btn-primary d-flex mx-auto fw-bold'>
                                {payBtnText}
                            </Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </Modal.Body >
        </>
    );
}

export default PaymentForm;