import React from 'react';
import { useState } from 'react'
import ItemContext from './ItemContext';

const ItemState = (props) => {
    const [accessToken, setAccessToken] = useState('');
    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [search, setSearch] = useState('');

    return (
        <ItemContext.Provider value={
            { accessToken, setAccessToken, user, setUser, cartItems, setCartItems, search, setSearch }
        }>
            {props.children}
        </ItemContext.Provider>
    )
}

export default ItemState;