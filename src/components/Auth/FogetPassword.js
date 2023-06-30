import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import ForgetPasswordImg from '../../images/login.png';
import { Form, Button } from "react-bootstrap";
import { FaUser, FaKey } from 'react-icons/fa';
import { Link } from "react-router-dom";
import axios from 'axios';

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateForm = () => {
        return email.length > 0 && password.length > 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = { email, password };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-password`, userData);
            toast.success(res.data['message']);
            setEmail('');
            setPassword('');
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    return (
        <>
            <div className="ForgetPassword Card">

                <div className="logo">
                    <img src={ForgetPasswordImg} alt="user" />
                </div>
                <div className="text-center mt-4 name">Change Password</div>

                <Form className="p-3 mt-3" onSubmit={handleSubmit}>

                    <Form.Group className="form-field d-flex align-items-center" controlId="email">
                        <FaUser />
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                    </Form.Group>

                    <Form.Group className="form-field d-flex align-items-center" controlId="password">
                        <FaKey />
                        <input type="password" placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button block="true" type="submit" disabled={!validateForm()}>Change Password</Button>
                    <ToastContainer />

                    <div className="d-flex justify-content-center mt-4">
                        <div className="" style={{ fontSize: '20px' }}>
                            <Link to='/register' style={{ fontSize: '20px' }}>&nbsp; Register</Link> or
                            <Link to='/login' style={{ fontSize: '20px' }}>&nbsp; Login</Link>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default ForgetPassword;