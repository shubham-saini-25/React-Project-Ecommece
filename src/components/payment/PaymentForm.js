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
    const { emptyCart, cartTotal } = useCart();
    const [customerInfo, setCustomerInfo] = useState('');

    const totalAmount = (cartTotal + props.shippingCharges).toFixed(2);

    const [payBtnText, setPayBtnText] = useState('Make Payment');

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

        setPayBtnText(<i className="fa fa-spinner fa-spin"></i>);
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/payment-invoice',
            },
        });

        if (result.error) {
            console.error(result.error);
            toast.error(result.error.message);
            setPayBtnText('Make Payment');
        } else {
            Swal.fire({
                title: 'Payment done successfully!',
                text: 'Thank you for your purchase!',
                icon: 'success',
            }).then(() => {
                navigate('/payment-invoice', {
                    userInfo: customerInfo,
                })
            });
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
                                    <AddressElement options={addressOptions} onChange={(e) => setCustomerInfo(e.value.address)} />
                                </Col>
                                <Col md={6}>
                                    <PaymentElement />
                                    <hr />
                                    <div className='table-responsive text-center mt-3'>
                                        <table className="table table-bordered border-light">
                                            <thead>
                                                <tr>
                                                    <td>Sub Total:</td>
                                                    <td>${cartTotal}</td>
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