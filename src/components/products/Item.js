import React, { useContext, useEffect, useState } from 'react';
import Products from './Products';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { HomeProducts } from '../../constants/data';
import ItemContext from '../../context/ItemContext';
import axios from 'axios';

const Item = () => {
    const [Product, setProduct] = useState([]);
    const { search } = useContext(ItemContext);
    const { items } = useParams();

    const showItems = async () => {

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-products`);
        const dbProducts = data.products;

        if (search !== '') {
            const filteredArray = dbProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
            setProduct(filteredArray);
        } else {
            if (items === undefined) {
                setProduct(HomeProducts);
            } else if (items === "laptops") {
                const laptops = dbProducts.filter(product => product.category === 'laptop');
                setProduct(laptops);
            } else if (items === "tablets") {
                const tablets = dbProducts.filter(product => product.category === 'tablet');
                setProduct(tablets);
            } else if (items === "mobiles") {
                const mobiles = dbProducts.filter(product => product.category === 'mobile');
                setProduct(mobiles);
            }
        }
    }

    useEffect(() => {
        showItems();
    }, [items, search]);

    return (
        <Row lg={3} style={{ marginLeft: "auto", marginRight: 'auto' }} >
            {Product.map((item, idx) => {
                return (
                    <Products key={idx} product={item} />
                )
            })}
        </Row>
    );
}

export default Item;