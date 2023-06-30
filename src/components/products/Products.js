import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import ItemContext from "../../context/ItemContext";
import { useCart } from "react-use-cart";
import Swal from 'sweetalert2';
import { fetchCategories, fetchProducts } from '../../constants/Api';

const Products = () => {
    const [product, setProduct] = useState([]);
    const { accessToken, search } = useContext(ItemContext);
    const { addItem, removeItem, inCart } = useCart(); // include inCart from useCart
    const navigate = useNavigate();
    const { items } = useParams();

    const cartAddBtnClicked = (item) => {
        // check if item is not already in cart
        if (!inCart(item.id)) {
            addItem(item);
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
                    setProduct(filteredArray);
                } else {
                    if (items === undefined) {
                        setProduct(dbCategory);
                    } else {
                        const filteredProducts = dbProducts.filter(product => product.category.toLowerCase() === items);
                        setProduct(filteredProducts);
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

    return (
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4" style={{ margin: "auto" }}>
            {product.map((item, idx) => (
                <Col key={idx}>
                    <Card className="border border-1 border-dark text-center mt-4" style={{ height: "32rem" }}>
                        <Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}/product_img/${item.image}`} alt="items" height={300} />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>{`Price: $${item.price}`}</Card.Text>
                            <Card.Text style={descriptionTextStyle}>{item.description}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div className='cartButton'>
                                {accessToken === null ? (
                                    <Button className='btn btn-warning mt-3 border border-1 border-dark mb-3' onClick={() => checkLogin()}>
                                        Add to Cart
                                    </Button>
                                ) : (
                                    <Button className={`btn btn-${inCart(item.id) ? 'success disabled text-dark' : 'warning'} mt-3 border border-1 border-dark mb-3`}
                                        onClick={() => cartAddBtnClicked(item)} disabled={inCart(item.id)}>
                                        {inCart(item.id) ? 'Added in Cart' : 'Add to Cart'}
                                    </Button>
                                )}
                                &emsp;
                                {inCart(item.id) && (
                                    <Button className='btn btn-danger mt-3 border border-1 border-dark mb-3' onClick={() => cartCancelBtnClicked(item.id)}>
                                        <i className='fa fa-times'></i>
                                    </Button>
                                )}
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default Products;