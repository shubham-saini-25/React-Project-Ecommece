import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Button, Modal } from 'react-bootstrap';
import EditProduct from './EditProduct';
import axios from 'axios';

const AdminProducts = () => {
    const [product, setProduct] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleShow = (itemId) => {
        setShow(true);
        setSelectedItemId(itemId);
    }

    const handleHide = () => {
        setShow(false)
    };

    const handleSubmit = async (event) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-products`);
            setProduct(result.data.products);
            // toast.success(result.data.message);
        } catch (err) {
            toast.error(err.response.data)
        }
    };

    useEffect(() => {
        handleSubmit();
    }, []);

    return (
        <>
            <Container className="mt-5 h-100 bg-light rounded-4">
                <ToastContainer />
                <div className="d-flex justify-content-center">
                    <h3 className="fs-1 fw-normal text-black mt-4">Product List</h3>
                </div>
                <hr />
                <div className="table-responsive">
                    <table className='table table-bordered border-secondary align-middle text-center'>
                        <thead>
                            <tr className='fs-5'>
                                <th>S.No.</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_API_URL}/${item.image}`} alt="product_img" width={50} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <div className='d-flex justify-content-center fa-2x'>
                                            <Button className='fa fa-pencil text-primary bg-light border-0' onClick={() => handleShow(item._id)}></Button>
                                            <Button className='fa fa-trash text-danger bg-light border-0'></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>

            <Modal show={show} onHide={handleHide} centered>
                <Modal.Header closeButton onClick={handleHide}>
                    <Modal.Title className='fs-2 mx-auto px-5'>Update Products</Modal.Title>
                </Modal.Header>
                {selectedItemId && <EditProduct product={product} itemId={selectedItemId} />}
            </Modal>
        </>
    );
}

export default AdminProducts;