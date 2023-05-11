import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { useCart } from "react-use-cart";
import ItemContext from "../context/ItemContext";

function HomeNavbar() {
    const { accessToken, setAccessToken } = useContext(ItemContext);
    const { totalUniqueItems } = useCart();
    console.log(accessToken, 'ffff');
    console.log(localStorage.getItem('JWT_Token'), 'sssss');

    const removeToken = () => {
        localStorage.removeItem('JWT_Token');
        setAccessToken('');
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
            <Navbar.Brand style={{ marginLeft: '20px' }} href="/">E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ marginRight: '20px' }} />
            <Navbar.Collapse id="responsive-navbar-nav" style={{ marginLeft: '20px' }}>

                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/contactUs">Contact Us</Nav.Link>
                    <Nav.Link href="/">Products</Nav.Link>
                </Nav>

                {accessToken === '' ?
                    <>
                        <Nav className="me-auto fw-bolder">
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                        </Nav>

                        <Form className="d-flex" style={{ marginRight: '40px' }}>
                            <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                            <Button variant="outline-success">Search</Button>
                        </Form>

                        <Nav.Link href="/cart-items" style={{ marginRight: '40px' }}>
                            <i className="cartIcon fa fa-shopping-cart fa-2x text-info mr-4 fw-bold"
                                value={totalUniqueItems}>
                            </i>
                        </Nav.Link>
                    </>
                    :
                    <>
                        <Form className="d-flex" style={{ marginRight: '10rem' }}>
                            <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                            <Button variant="outline-success">Search</Button>
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
        </Navbar>
    );
}

export default HomeNavbar;