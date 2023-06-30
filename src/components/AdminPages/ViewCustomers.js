import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const ViewCustomers = () => {
    const [users, setUsers] = useState([]);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-users`);
            const result = data.user.filter(user => user.role === 'Customer');
            setUsers(result);
            toast.success(data.message);
        } catch (err) {
            toast.error(err.response.data)
        }
    };
    handleSubmit();

    const deleteUser = (userId) => {
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
                    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-user/${userId}`);
                    toast.success(data.message);
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
                <div className="d-flex justify-content-center">
                    <h3 className="fs-1 fw-normal text-black mt-4">User List</h3>
                </div>
                <hr />
                <div className="table-responsive">
                    <table className='table table-bordered border-secondary align-middle text-center'>
                        <thead>
                            <tr className='fs-5'>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>role</th>
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
                                    <td>{user.role}</td>
                                    <td>
                                        <div className='d-flex justify-content-center fa-2x'>
                                            <Button className='fa fa-trash text-danger bg-transparent border-0' onClick={() => deleteUser(user._id)}></Button>
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

export default ViewCustomers;