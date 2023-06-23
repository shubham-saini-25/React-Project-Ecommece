import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RegisterUserImg from '../../images/register.png'
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaUserCircle, FaKey, FaMobileAlt } from 'react-icons/fa';
import axios from 'axios';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const validateForm = () => {
        return name.length > 0 && email.length > 0 && phoneNumber.length > 0 && password.length > 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = { name, email, phoneNumber, password };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, userData);
            toast.success(res.data.message);
            setName('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    return (
        <>
            <div className="Register Card">

                <div className="logo">
                    <img src={RegisterUserImg} alt="user" />
                </div>
                <div className="text-center mt-4 name">User Register</div>

                <Form className="p-3 mt-1" onSubmit={handleSubmit}>

                    <Form.Group className="form-field d-flex align-items-center">
                        <FaUser />
                        <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    </Form.Group>

                    <Form.Group className="form-field d-flex align-items-center">
                        <FaUserCircle />
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="form-field d-flex align-items-center">
                        <FaMobileAlt />
                        <input type="tel" placeholder="Enter Mobile Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="form-field d-flex align-items-center">
                        <FaKey />
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button block="true" type="submit" disabled={!validateForm()}>Register</Button>
                    <ToastContainer />

                    <div className="d-flex justify-content-center mt-4">
                        <div className="" style={{ fontSize: '18px' }}>
                            already a user? <Link to='/login' style={{ fontSize: '16px' }}>&nbsp; Login</Link>
                        </div>

                    </div>

                </Form>
            </div>
        </>
    );
}

export default Register;