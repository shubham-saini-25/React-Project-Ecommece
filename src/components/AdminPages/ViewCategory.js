import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { fetchCategories } from '../../constants/Api';
import UpdateCategory from './UpdateCategory';
import AddCategory from './AddCategory';
import Swal from 'sweetalert2';
import axios from 'axios';

const ViewCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState([]);
    const [show, setShow] = useState(false);
    const [btn, setBtn] = useState('');

    const handleShow = (Category) => {
        setShow(true);
        setSelectedCategory(Category);
    }

    const handleHide = () => {
        setShow(false);
    };

    const handleSubmit = async () => {
        if (window.location.pathname === '/admin/view-category') {
            try {
                const response = await fetchCategories();
                if (response) {
                    setCategory(response.category);
                }
            } catch (err) {
                toast.error(err.response.data)
            }
        }
    };
    handleSubmit();

    const deleteCategory = (categoryId) => {
        try {
            Swal.fire({
                title: 'Are you sure you want to delete this category?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                icon: 'warning',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const result = await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-category/${categoryId}`);
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
                    <h3 className="fs-1 fw-normal text-black mt-4">Category List</h3>
                    <div className='mt-4'>
                        <Button className='btn btn-primary' onClick={() => { handleShow(selectedCategory); setBtn('addCategory') }}>Add Category</Button>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='fw-bold'>
                            {category.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <img src={`${process.env.REACT_APP_API_URL}/category_img/${item.image}`} alt="category_img" width={100} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <div className='d-flex justify-content-center fa-2x'>
                                            <Button className='fa fa-pencil text-primary bg-transparent border-0' onClick={() => { handleShow(item); setBtn('updateCategory') }}></Button>
                                            <Button className='fa fa-trash text-danger bg-transparent border-0' onClick={() => deleteCategory(item._id)}></Button>
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
                        {btn === 'addCategory' ? 'Add Category' : 'Update Category'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {btn === 'addCategory' ? (
                        <AddCategory closeModal={handleHide} />
                    ) : (
                        selectedCategory && <UpdateCategory category={selectedCategory} closeModal={handleHide} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ViewCategory;