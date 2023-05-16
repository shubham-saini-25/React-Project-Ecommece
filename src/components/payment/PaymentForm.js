import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import Swal from 'sweetalert2';
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';

const PaymentForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { emptyCart } = useCart();

    const [customerInfo, setCustomerInfo] = useState('');
    const [email, setEmail] = useState('');

    const totalAmount = (props.totalPrice + props.shippingCharges).toFixed(2);

    const addressOptions = {
        mode: 'shipping',
        allowedCountries: ['US'],
        fields: {
            phone: 'always',
        },
        validation: {
            phone: {
                required: 'never',
            },
        },
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/payment-done',
            },
        });

        if (result.error) {
            console.error(result.error);
            toast.error(result.error.message);
        } else {
            Swal.fire({
                title: 'Payment done successfully!',
                text: 'Thank you for your purchase!',
                icon: 'success'
            }).then(() => { navigate('/payment-done') });
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
                                {/* <img src="http://surl.li/gwolo" width={150} alt="cardsImg"></img> */}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <AddressElement options={addressOptions} onChange={(e) => setCustomerInfo(e.value.address)} />
                                </Col>
                                <Col md={6}>
                                    <PaymentElement />
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button type='submit' disabled={!stripe} className='btn btn-primary d-flex mx-auto fw-bold'>
                                Make Payment (${totalAmount})
                            </Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </Modal.Body >
        </>
    );
}

export default PaymentForm;