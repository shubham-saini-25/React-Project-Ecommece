import React, { useEffect, useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { fetchUsers, deleteUser } from '../../Api/UserApi';
import { ToastContainer, toast } from 'react-toastify';
import UpdateUser from './UpdateUser';
import Swal from 'sweetalert2';

const ViewCustomers = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);

    const handleShow = (item) => {
        setShow(true);
        setSelectedUser(item);
    }

    const handleHide = () => {
        setShow(false)
        setTimeout(() => {
            setUpdateCount(updateCount + 1);
        }, 500);
    };

    const getUsers = async () => {
        try {
            const response = await fetchUsers();
            if (response) {
                const result = response.user.filter(user => user.role === 'Customer');
                setUsers(result);
            }
        } catch (err) {
            toast.error(err.response.data)
        }
    };

    useEffect(() => {
        getUsers();
    }, [updateCount]);

    const deleteUsers = (userId) => {
        try {
            Swal.fire({
                title: 'Are you sure you want to delete this user?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                icon: 'warning',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await deleteUser(userId);
                        toast.success(response.message);
                        setUpdateCount(updateCount + 1);
                    } catch (error) {
                        console.error(error);
                        toast.error(error.response?.data);
                    }
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
                <div className="d-flex justify-content-center mb-3">
                    <h3 className="fs-1 fw-normal text-black mt-4">User List</h3>
                </div>
                <div className="table-responsive">
                    <table className='table table-bordered border-secondary align-middle text-center'>
                        <thead>
                            <tr className='fs-5'>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='fw-bold'>
                            {users.map((user, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        <div className='d-flex justify-content-center fa-2x'>
                                            <Button className='fa fa-pencil text-primary bg-transparent border-0' onClick={() => handleShow(user)}></Button>
                                            <Button className='fa fa-trash text-danger bg-transparent border-0' onClick={() => deleteUsers(user._id)}></Button>
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
                    <Modal.Title className='fs-2 mx-auto px-5'>Update Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateUser user={selectedUser} closeModal={handleHide} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ViewCustomers;