import React from 'react';
import { useState } from 'react'
import ItemContext from './ItemContext';

const ItemState = (props) => {
    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [search, setSearch] = useState('');

    let token = localStorage.getItem('JWT_Token');
    const [accessToken, setAccessToken] = useState(token);

    return (
        <ItemContext.Provider value={
            { accessToken, setAccessToken, user, setUser, cartItems, setCartItems, search, setSearch }
        }>
            {props.children}
        </ItemContext.Provider>
    )
}

export default ItemState;