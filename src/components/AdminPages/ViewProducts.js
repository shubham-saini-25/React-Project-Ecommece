import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import Swal from 'sweetalert2';
import axios from 'axios';
import { fetchCategories, fetchProducts } from '../../constants/Api';

const ViewProducts = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [show, setShow] = useState(false);
    const [btn, setBtn] = useState('');

    const handleShow = (item) => {
        setShow(true);
        setSelectedProduct(item);
    }

    const handleHide = () => {
        setShow(false)
    };

    const handleSubmit = async () => {
        if (window.location.pathname === '/admin/view-products') {
            try {
                const responseCategory = await fetchCategories();
                if (responseCategory) {
                    setCategory(responseCategory.category);
                }

                const responseProduct = await fetchProducts();
                if (responseProduct) {
                    setProduct(responseProduct.products);
                }
            } catch (err) {
                toast.error(err.response.data)
            }
        }
    };
    handleSubmit();

    const deleteProduct = (itemId) => {
        try {
            Swal.fire({
                title: 'Are you sure you want to delete this product?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                icon: 'warning',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const result = await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-product/${itemId}`);
                    toast.success(result.data.message);
                }
            });
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    return (
        <>
            <Container className="admin mt-5 h-100 bg-light rounded-4">
                <ToastContainer />
                <div className="d-flex justify-content-around">
                    <h3 className="fs-1 fw-normal text-black mt-4">Product List</h3>
                    <div className='mt-4'>
                        <Button className='btn btn-primary' onClick={() => { handleShow(selectedProduct); setBtn('addProduct') }}>Add Product</Button>
                    </div>
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
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='fw-bold'>
                            {product.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_API_URL}/product_img/${item.image}`} alt="product_img" width={100} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.category}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <div className='d-flex justify-content-center fa-2x'>
                                            <Button className='fa fa-pencil text-primary bg-transparent border-0' onClick={() => { handleShow(item); setBtn('updateProduct') }}></Button>
                                            <Button className='fa fa-trash text-danger bg-transparent border-0' onClick={() => deleteProduct(item._id)}></Button>
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
                    <Modal.Title className='fs-2 mx-auto px-5'>
                        {btn === 'addProduct' ? 'Add Product' : 'Update Product'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {btn === 'addProduct' ? (
                        <AddProduct category={category} closeModal={handleHide} />
                    ) : (
                        selectedProduct && <UpdateProduct category={category} product={selectedProduct} closeModal={handleHide} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ViewProducts;