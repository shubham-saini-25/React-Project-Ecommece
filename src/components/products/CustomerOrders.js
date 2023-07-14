import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { fetchOrdersById } from '../../Api/OrderApi';
import ItemContext from '../../context/ItemContext';
import { returnOrder } from '../../Api/PaymentApi';
import Swal from 'sweetalert2';

const CustomerOrders = () => {
    const { authUserId } = useContext(ItemContext);
    const [orders, setOrders] = useState([]);

    const returnItem = async (orderId) => {
        const result = await Swal.fire({
            title: 'Are you sure you want to return this order',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Return",
            cancelButtonText: "Cancel",
            icon: 'info'
        });

        if (result.isConfirmed) {
            try {
                const { data } = await returnOrder(orderId);
                if (data.order.isReturned === true) {
                    toast.success('Order Returned successfully');
                    Swal.fire({
                        title: "Order Returned successfully!",
                        text: "Your refund will be automatically credited to your bank account within 7 days.",
                        icon: "success",
                    });
                } else {
                    toast.success('This order is already Returned.');
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data || 'An error occurred');
            }
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (authUserId) {
                try {
                    const result = await fetchOrdersById(authUserId);
                    setOrders(result.orders);
                } catch (error) {
                    console.error(error);
                    toast.error(error.response?.data || 'An error occurred');
                }
            }
        };
        fetchOrderDetails();
    }, [authUserId]);

    if (orders.length === 0) {
        return (
            <>
                <ToastContainer />
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <h1 className="display-3 fw-bold text-black">No Orders Found</h1>
                </div>
            </>
        );
    }

    return (
        <Container className="py-5">
            <ToastContainer />
            <Row className="itemCart d-flex justify-content-center">
                <Col xs={12} md={10}>
                    <div className="d-flex justify-content-center cursor-pointer">
                        <h3 className="fs-1 fw-normal text-black mt-3">Orders List</h3>
                    </div>
                    <hr />
                    <Card className="rounded-3 mb-4">
                        <Card.Body className="p-4">
                            <Row className="justify-content-between align-items-center text-center">
                                <Col>
                                    <h5 className="mb-0">Image</h5>
                                </Col>
                                <Col>
                                    <h5 className="mb-0">Name</h5>
                                </Col>
                                <Col>
                                    <h5 className="mb-0">Qty</h5>
                                </Col>
                                <Col>
                                    <h5 className="mb-0">Total</h5>
                                </Col>
                                <Col>
                                    <h5 className="mb-0">Purchase Date</h5>
                                </Col>
                                <Col>
                                    <h5 className="mb-0">Actions</h5>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {orders.map((order, idx) => (
                        <Card className="rounded-3 mb-4" key={idx}>
                            <Card.Body className="p-4">
                                <Row className="justify-content-between align-items-center text-center">
                                    <Col>
                                        <Card.Img className="rounded-3" src={`${process.env.REACT_APP_API_URL}/product_img/${order.image}`} alt={order.name} />
                                    </Col>

                                    <Col>
                                        <h5 className="mt-3">{order.name}</h5>
                                        <p className="fw-normal mt-3">Price: ${(order.price).toFixed(2)}</p>
                                    </Col>

                                    <Col>
                                        <h5 className="mb-0">{order.quantity}</h5>
                                    </Col>

                                    <Col>
                                        <h5 className="mb-0">${order.quantity > 0 ? (order.quantity * order.price).toFixed(2) : (order.price).toFixed(2)}</h5>
                                    </Col>

                                    <Col>
                                        <h5 className="mb-0">{order.orderDate}</h5>
                                    </Col>

                                    <Col>
                                        <Button className={`${order.isReturned ? 'btn-danger disabled' : 'btn-warning'}`} size="md" onClick={() => returnItem(order._id)}>
                                            {order.isReturned ? 'Returned' : 'Return'}
                                        </Button>
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