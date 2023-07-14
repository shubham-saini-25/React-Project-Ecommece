import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import ItemContext from "../../context/ItemContext";
import { useCart } from "react-use-cart";
import { Link } from 'react-router-dom';

function HomeNavbar() {
    const { search, setSearch, setAuthUserId } = useContext(ItemContext);
    const { accessToken, setAccessToken } = useContext(ItemContext);
    const [userRole, setUserRole] = useState('');
    const { totalUniqueItems } = useCart();

    const removeToken = () => {
        toast.success('User Logged Out Successfully!');
        localStorage.removeItem('JWT_Token');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTotal');
        localStorage.removeItem('UserRole');
        localStorage.removeItem('AuthId');
        setAccessToken(null);
        setAuthUserId(null);
        setUserRole(null);
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

    const role = localStorage.getItem('UserRole');

    useEffect(() => {
        setUserRole(role);
    }, [role]);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand style={{ marginLeft: '20px' }}>E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ marginRight: '20px' }} />

            <Navbar.Collapse id="responsive-navbar-nav" style={{ marginLeft: '20px' }}>
                <ToastContainer />
                <Nav className="me-auto">
                    {userRole === "Admin" ? (
                        <>
                            <Link to="/admin/home" className="nav-link">Home</Link>
                            <Link to="/admin/view-category" className="nav-link">View Category</Link>
                            <Link to="/admin/view-products" className="nav-link">View Product</Link>
                            <Link to="/admin/view-customers" className="nav-link">View Customers</Link>
                            <Link to="/admin/view-orders" className="nav-link">View Orders</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/about" className="nav-link">About</Link>
                            <Link to="/contactUs" className="nav-link">Contact Us</Link>
                            <Link to="/my-orders" className="nav-link">My Orders</Link>
                        </>
                    )}
                </Nav>

                {accessToken === null && (
                    <Nav className="middle-nav me-auto fw-bolder">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </Nav>
                )}

                <Nav className="ml-auto">
                    <Form className="d-flex" style={{ marginRight: '40px' }}>
                        <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={onChange} />
                        <Button variant="outline-success" onClick={onClick}>Search</Button>
                    </Form>

                    {accessToken === null ? (
                        <Link to="#" style={{ marginRight: '40px', marginTop: '4px' }} onClick={() => toast.info('Please log in to access your Cart')}>
                            <i className="cartIcon fa fa-shopping-cart fa-2x text-info mr-4 fw-bold" value={0}></i>
                        </Link>
                    ) : (
                        <Link to="/cart-items" style={{ marginRight: '40px', marginTop: '4px' }}>
                            <i className="cartIcon fa fa-shopping-cart fa-2x text-info mr-4 fw-bold" value={totalUniqueItems}></i>
                        </Link>
                    )}
                </Nav>

                {accessToken !== null && (
                    <Nav className="text-light" style={{ marginRight: '20px' }} onClick={() => removeToken()}>
                        <Link to="/login" className='btn btn-outline-secondary text-light'>
                            <span className='fa fa-sign-out'></span> Logout
                        </Link>
                    </Nav>
                )}
            </Navbar.Collapse>
        </Navbar >
    );
}

export default HomeNavbar;