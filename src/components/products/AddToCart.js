import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Row, Col, Container, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useCart } from "react-use-cart";
import { ToastContainer, toast } from 'react-toastify';
import ItemContext from '../../context/ItemContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../payment/PaymentForm';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const AddToCart = () => {
    const { isEmpty, totalUniqueItems, items, updateItemQuantity, removeItem, cartTotal, emptyCart } = useCart();
    const { secret, setSecret } = useContext(ItemContext);
    const [shippingCharges, setShippingCharges] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (cartTotal < 500) {
            setShippingCharges(99);
        } else {
            setShippingCharges(0);
        }

        async function fetchData() {
            const url = `${process.env.REACT_APP_API_URL}/api/process-payment`;
            const data = {
                amount: parseInt(cartTotal + shippingCharges) * 100,
                currency: 'usd',
            }
            const headers = {
                "Content-Type": "application/json",
            };

            const { clientSecret } = await axios.post(url, data, { headers: headers }).then((response) => response.data);
            setSecret(clientSecret);
        }
        fetchData();
    }, []);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false)
    };

    if (isEmpty) {
        return (
            <Container className="py-5 h-100">
                <ToastContainer />
                <Row className="itemCart justify-content-center align-items-center h-100">
                    <Col md="10">
                        <div className="d-flex justify-content-between mb-4">
                            <h3 className="fs-1 fw-normal text-black mt-3">Shopping Cart ({totalUniqueItems})</h3>
                            <Button className='h-25 mt-4' onClick={() => { emptyCart(); toast.info('Your cart is already empty') }} >Empty Cart</Button>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-center fw-bold' style={{ height: "40rem" }}>
                            <h1 className='display-3 fw-bold' style={{ marginTop: "15rem" }}>Your cart is empty</h1>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <>
            <Container className="py-5 h-100">
                <ToastContainer />
                <Row className="itemCart justify-content-center align-items-center h-100">
                    <Col md="10">
                        <div className="d-flex justify-content-between mb-4 cursor-pointer">
                            <h3 className="fs-1 fw-normal text-center text-black mt-3">Shopping Cart ({totalUniqueItems})</h3>
                            <Button className='h-25 mt-4' onClick={() => { emptyCart(); toast.success('Your cart is cleared successfully') }}>Empty Cart</Button>
                        </div>
                        <hr />

                        {items.map((item) => (
                            <Card className="rounded-3 mb-4" key={item.id}>
                                <Card.Body className="p-4">
                                    <Row className="justify-content-between align-items-center">
                                        <Col md="2" lg="2" xl="2">
                                            <Card.Img className="rounded-3" fluid="true" src={`${process.env.REACT_APP_API_URL}/${item.image}`} alt={item.name} />
                                        </Col>

                                        <Col md="3" lg="3" xl="3">
                                            <h5 className="mt-3">{item.name}</h5>
                                            <p className="fw-normal mt-3">Price: ${(item.price).toFixed(2)}</p>
                                        </Col>

                                        <Col md="3" lg="3" xl="2"
                                            className="d-flex align-items-center justify-content-around" >
                                            <Button variant="link" onClick={() => {
                                                (item.quantity !== 1 ? updateItemQuantity(item.id, item.quantity - 1) : toast.info('At least one item selection is mandatory'));
                                            }}><i className="fa fa-minus"></i>
                                            </Button>
                                            <Form.Control fluid="true" type="text" className='text-center' value={item.quantity > 0 ? item.quantity : 1} readOnly />
                                            <Button variant="link" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                                                <i className="fa fa-plus"></i>
                                            </Button>
                                        </Col>

                                        <Col md="3" lg="2" xl="2" className="offset-lg-1">
                                            <h5 className="mb-0">${item.itemTotal.toFixed(2)}</h5>
                                        </Col>

                                        <Col md="1" lg="1" xl="1" className="text-end">
                                            <button className='fa fa-trash fa-2x text-danger bg-light border border-0'
                                                onClick={() => { removeItem(item.id); toast.success('Item deleted successfully!') }}>
                                            </button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                        <hr />

                        <Button className="btn btn-warning fw-bold d-flex mx-auto mb-4 border border-1 border-dark" size="lg"
                            onClick={handleShow} >
                            <i className="fa fa-credit-card my-auto"></i>
                            &nbsp; Proceed to Checkout &nbsp;
                            <i className='fa fa-long-arrow-right my-auto'></i>
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Modal size="lg" show={show} onHide={handleHide} backdrop="static" keyboard={false}>
                <Modal.Header closeButton onClick={handleHide}>
                    <Modal.Title>Payment Gateway...</Modal.Title>
                </Modal.Header>
                <Elements stripe={stripePromise} options={{ clientSecret: secret }}>
                    <PaymentForm shippingCharges={shippingCharges} />
                </Elements>
            </Modal>
        </>
    );
}

export default AddToCart;