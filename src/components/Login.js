import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaUser, FaKey } from 'react-icons/fa';
import LoginUserImg from '../images/login.png'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import ItemContext from "../context/ItemContext";
import axios from 'axios';

function Login() {
    const { accessToken, setAccessToken } = useContext(ItemContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginBtnText, setLoginBtnText] = useState('Login');
    const navigate = useNavigate();

    const validateForm = () => {
        return email.length > 0 && password.length > 0;
    }
    console.log(accessToken, 'dddddddddddd')

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = { email, password };
        const url = `${process.env.REACT_APP_API_URL}/api/login`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        };

        try {
            const res = await axios.post(url, userData, { headers: headers });
            localStorage.setItem('JWT_Token', res.data.token);
            setLoginBtnText(<i className="fa fa-spinner fa-spin"></i>);
            toast.success(res.data['message']);
            setEmail('');
            setPassword('');
            setAccessToken(res.data.token);
            setTimeout(() => { navigate('/') }, 2000);
        } catch (err) {
            setLoginBtnText('Login')
            toast.error(err.response.data)
        }
    }

    return (
        <>
            <div className="Login Card">

                <div className="logo">
                    <img src={LoginUserImg} alt="user" />
                </div>
                <div className="text-center mt-4 name">User Login</div>

                <Form className="p-3 mt-3" onSubmit={handleSubmit}>

                    <Form.Group className="form-field d-flex align-items-center" controlId="email">
                        <FaUser />
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                    </Form.Group>

                    <Form.Group className="form-field d-flex align-items-center" controlId="password">
                        <FaKey />
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button block="true" type="submit" disabled={!validateForm()}>{loginBtnText}</Button>
                    <ToastContainer />

                    <div className="d-flex justify-content-center mt-4">
                        <div className="" style={{ fontSize: '18px' }}>
                            <Link to='/forget-password' oppstyle={{ fontSize: '16px' }}>Forget Password &nbsp;</Link>or<Link to='/register' style={{ fontSize: '16px' }}>&nbsp; Register</Link>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default Login;