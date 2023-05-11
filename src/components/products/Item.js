import React, { useEffect, useState } from 'react';
import Products from '../Products';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { HomeProducts, Laptops, Tablets, Mobiles } from '../../constants/data';

const Item = (props) => {
    const [Product, setProduct] = useState([]);
    const { items } = useParams();

    const showItems = () => {
        if (items === undefined) {
            setProduct(HomeProducts);
        } else if (items === "laptops") {
            setProduct(Laptops);
        } else if (items === "tablets") {
            setProduct(Tablets);
        } else if (items === "mobiles") {
            setProduct(Mobiles);
        }
    }

    useEffect(() => {
        showItems();
    }, [items]);

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