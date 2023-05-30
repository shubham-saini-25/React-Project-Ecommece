import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { useCart } from "react-use-cart";
import ItemContext from "../../context/ItemContext";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

function HomeNavbar() {
    const { accessToken, setAccessToken } = useContext(ItemContext);
    const { search, setSearch } = useContext(ItemContext);
    const { setAuthUserId } = useContext(ItemContext);
    const { totalUniqueItems } = useCart();
    const [navbarItems, setNavbarItems] = useState('');

    const removeToken = () => {
        localStorage.removeItem('JWT_Token');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTotal');
        localStorage.removeItem('AuthId');
        setAccessToken('');
        setAuthUserId('');
    };

    const onClick = (e) => {
        e.preventDefault();

        if (search === '') {
            toast.info('Please enter a search term');
        } else {
            setSearch(e.target.value);
        }
    };

    const onChange = (e) => setSearch(e.target.value);

    const userId = localStorage.getItem('AuthId');
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-user/${userId}`);
                setNavbarItems(res.data.user[0].purpose);
            } catch (err) {
                toast.error(err.response.message)
            }
        }
        getUser();
    }, [userId]);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand style={{ marginLeft: '20px' }} href="/">E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ marginRight: '20px' }} />

            {(navbarItems !== "Sell" || navbarItems === undefined || navbarItems === null) ?
                <Navbar.Collapse id="responsive-navbar-nav" style={{ marginLeft: '20px' }}>

                    <ToastContainer />
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/contactUs">Contact Us</Nav.Link>
                        <Nav.Link href="/my-orders">My Orders</Nav.Link>
                    </Nav>

                    {accessToken === null ?
                        <>
                            <Nav className="me-auto fw-bolder">
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                            </Nav>

                            <Form className="d-flex" style={{ marginRight: '40px' }}>
                                <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={onChange} />
                                <Button variant="outline-success" onClick={onClick}>Search</Button>
                            </Form>

                            <Nav.Link href="#" style={{ marginRight: '40px' }} onClick={() => toast.error('please login to access your Cart')}>
                                <i className="cartIcon fa fa-shopping-cart fa-2x text-info mr-4 fw-bold" value={0}></i>
                            </Nav.Link>
                        </>
                        :
                        <>
                            <Form className="d-flex" style={{ marginRight: '10rem' }}>
                                <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={onChange} />
                                <Button variant="outline-success" onClick={onClick}>Search</Button>
                            </Form>

                            <Nav.Link href="/cart-items" style={{ marginRight: '60px' }}>
                                <i className="cartIcon fa fa-shopping-cart fa-2x text-info mr-4 fw-bold"
                                    value={totalUniqueItems}>
                                </i>
                            </Nav.Link>

                            <Nav className="text-light" style={{ marginRight: '20px' }} onClick={() => removeToken()}>
                                <Nav.Link href="/login" className='btn btn-outline-secondary text-light'>
                                    <span className='fa fa-sign-out'></span> Logout
                                </Nav.Link>
                            </Nav>
                        </>
                    }
                </Navbar.Collapse>
                :
                <Navbar.Collapse id="responsive-navbar-nav" style={{ marginLeft: '20px' }}>

                    <ToastContainer />
                    <Nav className="me-auto">
                        <Nav.Link href="/admin/home">Home</Nav.Link>
                        <Nav.Link href="/admin/add-products">Add Product</Nav.Link>
                        <Nav.Link href="/admin/view-products">View Product</Nav.Link>
                        <Nav.Link href="/admin/view-users">View Customers</Nav.Link>
                    </Nav>

                    {accessToken !== null &&
                        <>
                            <Nav className="text-light" style={{ marginRight: '20px' }} onClick={() => removeToken()}>
                                <Nav.Link href="/login" className='btn btn-outline-secondary text-light'>
                                    <span className='fa fa-sign-out'></span> Logout
                                </Nav.Link>
                            </Nav>
                        </>
                    }
                </Navbar.Collapse>
            }
        </Navbar >
    );
}

export default HomeNavbar;