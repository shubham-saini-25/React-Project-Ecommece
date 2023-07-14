import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '../../Api/CategoryApi';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProducts } from '../../Api/ProductApi';
import ItemContext from "../../context/ItemContext";
import { useCart } from "react-use-cart";
import Swal from 'sweetalert2';

const Products = () => {
    const { accessToken, search } = useContext(ItemContext);
    const { addItem, removeItem, inCart } = useCart();
    const [showModal, setShowModal] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { items } = useParams();

    const handleShow = (itemId) => {
        setShowModal(itemId);
    };

    const handleHide = () => {
        setShowModal(null);
    };

    const cartAddBtnClicked = (item) => {
        // check if item is not already in cart
        if (!inCart(item.id)) {
            addItem(item);
            toast.success('Product added successfully in your cart');
        }
    };

    useEffect(() => {
        const showProducts = async () => {
            try {
                const responseProducts = await fetchProducts();
                const dbProducts = responseProducts.products;

                const responseCategories = await fetchCategories();
                const dbCategory = responseCategories.category;

                if (search !== '') {
                    const filteredArray = dbProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
                    setProducts(filteredArray);
                } else {
                    if (items === undefined) {
                        setProducts(dbCategory);
                    } else {
                        const filteredProducts = dbProducts.filter(product => product.category.toLowerCase() === items);
                        setProducts(filteredProducts);
                    }
                }
            } catch (err) {
                console.error('Error in getting data =>', err);
            }
        }
        showProducts();
    }, [items, search]);

    const cartCancelBtnClicked = (itemId) => {
        removeItem(itemId);
        toast.success('Product removed successfully from your cart');
    }

    const descriptionTextStyle = {
        display: 'inlineBlock',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    }

    const checkLogin = () => {
        Swal.fire({
            title: 'Please login before adding items to your cart',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Login",
            cancelButtonText: "Cancel",
            icon: 'info'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login');
            }
        })
    }

    if (products.length === 0) {
        return (
            <>
                <ToastContainer />
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <h1 className="display-3 fw-bold text-black">No Products Found</h1>
                </div>
            </>
        );
    }

    return (
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4" style={{ margin: "auto" }}>
            {products.map((product, idx) => (
                <Col key={idx}>
                    <ToastContainer />
                    <Card className="productCard text-center mt-4">
                        <Card.Img variant="top" className='productImg' src={`${process.env.REACT_APP_API_URL}/product_img/${product.image}`} alt="items" height={300} />
                        <Card.Body>
                            <Card.Title><h4>{product.name}</h4></Card.Title>
                            <Card.Text style={descriptionTextStyle}>{product.description}</Card.Text>
                            <Card.Text as="div" className='d-flex justify-content-center'>
                                <h6 className='mt-2'>{`Price: $${product.price}`}</h6>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div className='productButton'>
                                {accessToken === null ? (
                                    <>
                                        <Button className='btn mt-2 text-black' onClick={() => handleShow(product.id)}>More Details</Button>
                                        <Button className='btn mt-3' onClick={() => checkLogin()}>Add to Cart</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className='btn mt-2 text-black' onClick={() => handleShow(product.id)}>More Details</Button>
                                        <Button className={`btn btn-${inCart(product.id) ? 'disabled text-dark' : 'warning'} mt-3 border border-1 border-dark`}
                                            onClick={() => cartAddBtnClicked(product)} disabled={inCart(product.id)}>
                                            {inCart(product.id) ? 'Added in Cart' : 'Add to Cart'}
                                        </Button>
                                    </>
                                )}
                                &emsp;
                                {inCart(product.id) && (
                                    <Button className='bg-danger mt-3 w-25' onClick={() => cartCancelBtnClicked(product.id)}>
                                        <i className='fa fa-times'></i>
                                    </Button>
                                )}
                            </div>
                        </Card.Footer>
                    </Card>
                    <Modal size="lg" show={showModal === product.id} onHide={handleHide}>
                        <Modal.Header closeButton onClick={handleHide}>
                            <Modal.Title>More details about product: {product.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <img src={`${process.env.REACT_APP_API_URL}/product_img/${product.image}`} alt="items" height={350} />
                            <h2 className='mt-3'>{product.name}</h2>
                            <h5 className='mt-3'>Description: {product.description}</h5>
                            <h4 className='mt-4'>{`Price: $${product.price}`}</h4>
                            <h4 className='mt-4'>{`Category: ${product.category}`}</h4>
                            <div className='productButton mt-3'>
                                {accessToken === null ? (
                                    <Button className='btn mt-3' onClick={() => checkLogin()}>Add to Cart</Button>
                                ) : (
                                    <Button className={`btn btn-${inCart(product.id) ? 'disabled text-dark' : 'warning'} mt-3 border border-1 border-dark`}
                                        onClick={() => cartAddBtnClicked(product)} disabled={inCart(product.id)}>
                                        {inCart(product.id) ? 'Added in Cart' : 'Add to Cart'}
                                    </Button>
                                )}
                                {inCart(product.id) && (
                                    <Button className='bg-danger mt-3 w-25' onClick={() => cartCancelBtnClicked(product.id)}>
                                        <i className='fa fa-times'></i>
                                    </Button>
                                )}
                            </div>
                        </Modal.Body>
                    </Modal>
                </Col>
            ))}
        </Row >
    );
}

export default Products;