import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemContext from "../../context/ItemContext";
import { useCart } from "react-use-cart";
import Swal from 'sweetalert2';

const Products = (props) => {
    const { accessToken } = useContext(ItemContext);
    const { id, name, description, price, image, link } = props.product;
    const [cartBtnText, setCartBtnText] = useState('Add to Card');
    const [cartBtnClass, setCartBtnClass] = useState('warning');
    const [cartCancelClass, setCartCancelClass] = useState('d-none');
    const { items } = useParams(); // get the pathname from URL
    const { addItem, removeItem } = useCart(); // call a pre-define method for set the items into the cart
    const navigate = useNavigate();

    const cartAddBtnClicked = () => {
        setCartBtnText('Added to Cart');
        setCartBtnClass('success disabled text-dark');
        setCartCancelClass('');
        addItem(props.product); // set the items into Cart
    }

    const cartCancelBtnClicked = () => {
        setCartBtnText('Add to Card');
        setCartBtnClass('warning');
        setCartCancelClass('d-none');
        removeItem(id);
    }

    const descriptionTextStyle = {
        display: 'inlineBlock',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }

    const checkLogin = () => {
        Swal.fire({
            title: 'Please login before add items into your cart',
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
        <div className="col-lg-3 mb-4">
            <div className="card border border-1 border-dark text-center mt-4" style={{ height: items !== undefined ? "32rem" : "" }}>
                <img className="card-img-top" src={image} alt="items" height={300} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{price !== undefined ? (`Price : $${price} `) : ''}</p>
                    <p className="card-text" style={descriptionTextStyle}>{description !== undefined ? description : ''}</p>
                </div>
                <div className='card-footer'>
                    <div className='cartButton'>
                        {accessToken === null ?
                            <button className={`btn btn-${cartBtnClass} mt-3 border border-1 border-dark mb-3`}
                                onClick={() => { items === undefined ? navigate(`/items/${link}`) : checkLogin() }}>
                                {items !== undefined ? `${cartBtnText}` : 'Show More'}
                            </button>
                            :
                            <button className={`btn btn-${cartBtnClass} mt-3 border border-1 border-dark mb-3`}
                                onClick={() => { items !== undefined ? cartAddBtnClicked() : navigate(`/items/${link}`) }}>{items !== undefined ? `${cartBtnText}` : 'Show More'}
                            </button>
                        }
                        &emsp;
                        <button className={`btn btn-danger ${cartCancelClass} mt-3 border border-1 border-dark mb-3`}
                            onClick={() => cartCancelBtnClicked()}><i className='fa fa-times'></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;