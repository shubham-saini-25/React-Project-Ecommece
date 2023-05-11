import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useCart } from "react-use-cart";
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from "react-router-dom";
import { Elements, useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { emptyCart } = useCart();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [cardNum, setCardNum] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const totalAmount = (props.prices.totalPrice + props.prices.shippingCharges).toFixed(2);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = `${process.env.REACT_APP_API_URL}/api/process-payment`;
        const data = {
            email: email,
            amount: totalAmount * 100,
            currency: 'usd',
        }
        const headers = {
            "Content-Type": "application/json",
        };

        const { error } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                name: name,
                email: email,
            },
        });

        if (error) {
            toast.error(error.message);
            console.error('error =>', error);
        } else {
            const { clientSecret } = await axios.post(
                url, data, { headers: headers }
            ).then((response) => response.data);
            console.log('secret =>', clientSecret);

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: name,
                        email: email,
                    },
                },
            });

            if (result.error) {
                console.error(result.error);
                toast.error(result.error.message);
            } else {
                Swal.fire('Payment done successfully!', '', 'success');
                setTimeout(() => {
                    // emptyCart();
                    // navigate('/');
                }, 3000);
            }
        }
    };

    return (
        <Modal.Body>
            <ToastContainer />
            <Form autoComplete="off" onSubmit={handleSubmit}>
                <CardElement />
                <Card className="text-dark rounded-3 h-100">
                    <Card.Header>
                        <div className="text-center">
                            <h5>Pay with Card</h5>
                            <img src="http://surl.li/gwolo" width={150} alt="cardsImg"></img>
                        </div>
                    </Card.Header>
                    <Card.Body>

                        <Form.Text className="text-dark">Card Holder's Name</Form.Text>
                        <Form.Control className="fs-6 mb-3" label="CardHolder Name" type="text" size="lg"
                            onChange={(e) => setName(e.target.value)} placeholder="Card Holder Name" />

                        <Form.Text className="text-dark">Email</Form.Text>
                        <Form.Control className="fs-6 mb-3" label="Email" type="email" size="lg"
                            onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email" />

                        <PaymentElement />
                    </Card.Body>
                    <Card.Footer>
                        <Button type='submit' disabled={!stripe} className='btn btn-dark w-100 fw-bold'>
                            Make Payment (${totalAmount})
                        </Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Modal.Body >
    );
}

export default function PaymentForm(props) {
    const options = {
        clientSecret: 'pi_3N6Df0IpMDS0MrbB0vD79NMG_secret_JncMMRraSb4WhtXTvxHlV9c07',
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm prices={props} />
        </Elements>
    );
}