import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import ItemContext from '../../context/ItemContext';
import axios from 'axios';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const { authUserId } = useContext(ItemContext);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-orders/${authUserId}`);
                setOrders(data.orders);
            } catch (error) {
                console.log(error);
                toast.error(error.response.data);
            }
        };
        fetchOrderDetails();
    }, [authUserId]);

    if (orders.length === 0) {
        return (
            <>
                <ToastContainer />
                <div className="d-flex justify-content-center" style={{ marginTop: "20rem" }}>
                    <h1 className="display-3 fw-bold text-black mt-4">No Orders Found</h1>
                </div>
            </>
        );
    }

    return (
        <Container className="py-5 h-100">
            <ToastContainer />
            <Row className="itemCart justify-content-center align-items-center h-100">
                <Col md="10">
                    <div className="d-flex justify-content-center cursor-pointer">
                        <h3 className="fs-1 fw-normal text-center text-black mt-3">Orders List</h3>
                    </div>
                    <hr />
                    <Card className="rounded-3 mb-4">
                        <Card.Body className="p-4">
                            <Row className="justify-content-between align-items-center text-center">
                                <Col md="2" lg="2" xl="2">
                                    <h5 className="mb-0">Image</h5>
                                </Col>

                                <Col md="3" lg="3" xl="3">
                                    <h5 className="mb-0">Name</h5>
                                </Col>

                                <Col md="3" lg="2" xl="2">
                                    <h5 className="mb-0">Quantity</h5>
                                </Col>

                                <Col md="3" lg="2" xl="2">
                                    <h5 className="mb-0">Total</h5>
                                </Col>

                                <Col md="3" lg="2" xl="2">
                                    <h5 className="mb-0">Purchase Date</h5>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {orders.map((order, idx) => (
                        <Card className="rounded-3 mb-4" key={idx}>
                            <Card.Body className="p-4">
                                <Row className="justify-content-between align-items-center text-center">
                                    <Col md="2" lg="2" xl="2">
                                        <Card.Img className="rounded-3" fluid="true" src={`${process.env.REACT_APP_API_URL}/${order.image}`} alt={order.name} />
                                    </Col>

                                    <Col md="3" lg="3" xl="3">
                                        <h5 className="mt-3">{order.name}</h5>
                                        <p className="fw-normal mt-3">Price: ${(order.price).toFixed(2)}</p>
                                    </Col>

                                    <Col md="3" lg="2" xl="2">
                                        <h5 className="mb-0">{order.quantity}</h5>
                                    </Col>

                                    <Col md="3" lg="2" xl="2">
                                        <h5 className="mb-0">${order.quantity > 0 ? (order.quantity * order.price).toFixed(2) : (order.price).toFixed(2)}</h5>
                                    </Col>

                                    <Col md="3" lg="2" xl="2">
                                        <h5 className="mb-0">{order.orderDate}</h5>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <hr />
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerOrders;