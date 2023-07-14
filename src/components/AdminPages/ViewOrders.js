import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchAllOrders } from '../../Api/OrderApi';
import { Container } from 'react-bootstrap';

const ViewOrders = () => {
    const [updateCount, setUpdateCount] = useState(0);
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            const response = await fetchAllOrders();
            if (response) {
                setOrders(response.orders);
                setUpdateCount(updateCount + 1);
            }
        } catch (err) {
            toast.error(err.response.data)
        }
    };

    useEffect(() => {
        getOrders();
    }, [updateCount]);

    return (
        <>
            <Container className="admin mt-5 h-100 bg-light rounded-4">
                <ToastContainer />
                <div className="d-flex justify-content-center mb-3">
                    <h3 className="fs-1 fw-normal text-black mt-4">Orders List</h3>
                </div>
                <div className="table-responsive">
                    <table className='table table-bordered border-secondary align-middle text-center'>
                        <thead>
                            <tr className='fs-5'>
                                <th>S.No.</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Order Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className='fw-bold'>
                            {orders.map((order, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_API_URL}/product_img/${order.image}`} alt="order_img" width={100} />
                                    </td>
                                    <td>{order.name}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.price}</td>
                                    <td>{order.orderDate}</td>
                                    <td>
                                        <div className={`fs-5 text-light ${order.isReturned === true ? 'bg-danger' : 'bg-success'}`}>
                                            {order.isReturned === true ? "Returned" : "Delivered"}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
}

export default ViewOrders;