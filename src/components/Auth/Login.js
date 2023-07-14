import React, { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import ItemContext from "../../context/ItemContext";
import LoginUserImg from '../../images/login.png';
import { Form, Button } from "react-bootstrap";
import { FaUser, FaKey } from 'react-icons/fa';
import { userLogin } from "../../Api/AuthApi";

function Login() {
    const { setAccessToken, setAuthUserId } = useContext(ItemContext);
    const [loginBtnText, setLoginBtnText] = useState('Login');
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        return email.length > 0 && password.length > 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = { email, password };

        try {
            const response = await userLogin(userData);
            localStorage.setItem('JWT_Token', response.token);
            localStorage.setItem('UserRole', response.role);
            localStorage.setItem('AuthId', response.userId);
            setLoginBtnText(<i className="fa fa-spinner fa-spin"></i>);
            toast.success(response['message']);
            setAccessToken(response.token);
            setAuthUserId(response.userId);
            setEmail('');
            setPassword('');
            setTimeout(() => { response.role === "Customer" ? navigate('/') : navigate('/admin/home') }, 1500);
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
                            <Link to='/forget-password' style={{ fontSize: '16px' }}>Forget Password &nbsp;</Link>or<Link to='/register' style={{ fontSize: '16px' }}>&nbsp; Register</Link>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default Login;