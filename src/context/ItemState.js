import React from 'react';
import { useState } from 'react'
import ItemContext from './ItemContext';

const ItemState = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [search, setSearch] = useState('');
    const [secret, setSecret] = useState('');

    const authId = localStorage.getItem('AuthId');
    const [authUserId, setAuthUserId] = useState(authId);
    const [shippingCharges, setShippingCharges] = useState(0);

    let token = localStorage.getItem('JWT_Token');
    const [accessToken, setAccessToken] = useState(token);

    return (
        <ItemContext.Provider value={
            {
                accessToken, setAccessToken,
                authUserId, setAuthUserId,
                cartItems, setCartItems,
                search, setSearch,
                secret, setSecret,
                shippingCharges, setShippingCharges,
            }
        }>
            {props.children}
        </ItemContext.Provider>
    )
}

export default ItemState;