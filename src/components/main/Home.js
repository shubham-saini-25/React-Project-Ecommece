import React, { useEffect, useState } from "react";
import { fetchCategories } from '../../constants/Api';
import Carousel from 'react-bootstrap/Carousel';

function Home() {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const categories = async () => {
            try {
                const response = await fetchCategories();
                if (response) {
                    setCategory(response.category);
                }
            } catch (err) {
                console.error('Error in getting category =>', err);
            }
        }
        categories();
    }, []);

    return (
        <Carousel fade>
            {category.map((item, idx) => (
                <Carousel.Item interval={800} key={idx}>
                    <img className="d-block w-100" src={`${process.env.REACT_APP_API_URL}/category_img/${item.image}`} alt="Categories" />
                    <Carousel.Caption>
                        <h4>{item.name}</h4>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default Home;