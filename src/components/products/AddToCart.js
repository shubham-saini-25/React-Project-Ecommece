import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Card, Row, Col, Container, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { processPayment } from '../../Api/PaymentApi';
import ItemContext from '../../context/ItemContext';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../payment/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from "react-use-cart";
import Swal from 'sweetalert2';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const AddToCart = () => {
    const { isEmpty, totalUniqueItems, items, updateItemQuantity, removeItem, cartTotal, emptyCart } = useCart();
    const { secret, setSecret, setShippingCharges } = useContext(ItemContext);
    const [show, setShow] = useState(false);

    useEffect(() => {
        let deleveryCharge = 0;

        if (cartTotal < 500) {
            deleveryCharge = 99;
            setShippingCharges(deleveryCharge);
        } else {
            deleveryCharge = 0;
            setShippingCharges(deleveryCharge);
        }

        async function fetchData() {
            const data = {
                amount: parseInt(cartTotal + deleveryCharge) * 100,
                currency: 'usd',
            }

            const { clientSecret } = await processPayment(data);
            setSecret(clientSecret);
        }
        fetchData();
    }, [cartTotal]);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false)
    };

    const deleteItem = (itemId) => {
        try {
            Swal.fire({
                title: 'Are you sure you want to delete this item?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                icon: 'warning',
            }).then((result) => {
                if (result.isConfirmed) {
                    removeItem(itemId);
                    toast.success('Item deleted successfully!');
                }
            });
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    const clearCart = () => {
        try {
            Swal.fire({
                title: 'Are you really want to clear the Cart?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                icon: 'warning',
            }).then((result) => {
                if (result.isConfirmed) {
                    emptyCart();
                    toast.success('Your cart is cleared successfully!');
                }
            });
        } catch (err) {
            toast.error(err.response.data)
        }
    }

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
                            <Button className='h-25 mt-4' onClick={() => clearCart()}>Empty Cart</Button>
                        </div>
                        <hr />

                        {items.map((item) => (
                            <Card className="rounded-3 mb-4" key={item.id}>
                                <Card.Body className="p-4">
                                    <Row className="justify-content-between align-items-center">
                                        <Col md="2" lg="2" xl="2">
                                            <Card.Img className="rounded-3" fluid="true" src={`${process.env.REACT_APP_API_URL}/product_img/${item.image}`} alt={item.name} />
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
                                            <button className='fa fa-trash fa-2x text-danger bg-light border border-0' onClick={() => deleteItem(item.id)}></button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                        <hr />

                        <Button className="btn btn-warning fw-bold d-flex mx-auto mb-4 border border-1 border-dark" size="lg" onClick={handleShow}>
                            <i className="fa fa-credit-card my-auto"></i>
                            &nbsp; Proceed to Checkout (${cartTotal})&nbsp;
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
                    <PaymentForm />
                </Elements>
            </Modal>
        </>
    );
}

export default AddToCart;