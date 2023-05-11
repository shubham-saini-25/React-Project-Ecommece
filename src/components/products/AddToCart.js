import React, { useState } from 'react';
import { Button, Card, Row, Col, Container, Form } from "react-bootstrap";
import { useCart } from "react-use-cart";
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import PaymentForm from '../PaymentForm';

const AddToCart = () => {
    const { isEmpty, totalUniqueItems, items, updateItemQuantity, removeItem, cartTotal } = useCart();
    const [show, setShow] = useState(false);

    const SHIPPING_CHARGES = 20;

    const handleShow = async () => {
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
                        <div className="mb-4 cursor-pointer">
                            <h3 className="fs-1 fw-normal text-center text-black mt-3">Shopping Cart ({totalUniqueItems})</h3>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-center fw-bold' style={{ height: "40rem" }}>
                            <h1 className='display-3 fw-bold' style={{ marginTop: "15rem" }}>Your cart is empty</h1>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    };

    return (
        <>
            <Container className="py-5 h-100">
                <ToastContainer />
                <Row className="itemCart justify-content-center align-items-center h-100">
                    <Col md="10">
                        <div className="mb-4 cursor-pointer">
                            <h3 className="fs-1 fw-normal text-center text-black mt-3">Shopping Cart ({totalUniqueItems})</h3>
                        </div>
                        <hr />

                        {items.map((item) => (
                            <Card className="rounded-3 mb-4" key={item.id}>
                                <Card.Body className="p-4">
                                    <Row className="justify-content-between align-items-center">
                                        <Col md="2" lg="2" xl="2">
                                            <Card.Img className="rounded-3" fluid="true"
                                                src={item.image} alt={item.name} />
                                        </Col>

                                        <Col md="3" lg="3" xl="3">
                                            <p className="lead fw-normal mt-3">{item.name}</p>
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
                                            <h5 className="mb-0">${item.quantity > 0 ? (item.quantity * item.price).toFixed(2) : (item.price).toFixed(2)}</h5>
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

            <Modal size="md" show={show} onHide={handleHide}>
                <Modal.Header closeButton onClick={handleHide}>
                    <Modal.Title>Payment Gateway...</Modal.Title>
                </Modal.Header>
                <PaymentForm totalPrice={cartTotal} shippingCharges={SHIPPING_CHARGES} />
            </Modal>
        </>
    );
}

export default AddToCart;