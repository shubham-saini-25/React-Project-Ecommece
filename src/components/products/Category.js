import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { fetchCategories } from '../../Api/CategoryApi';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await fetchCategories();
                if (response) {
                    setCategory(response.category);
                }
            } catch (err) {
                console.error('Error in getting category =>', err);
            }
        }
        getCategory();
    }, []);

    return (
        <Row style={{ margin: 'auto' }}>
            {category.map((category, idx) => (
                <Col lg={3} key={idx}>
                    <Card className="border border-1 border-dark text-center mt-4">
                        <Card.Img src={`${process.env.REACT_APP_API_URL}/category_img/${category.image}`} alt="category" height={300} />
                        <Card.Body>
                            <Card.Title>{category.name}</Card.Title>
                        </Card.Body>
                        <Card.Footer>
                            <div className='cartButton'>
                                <Button className="btn btn-warning mt-3 border border-1 border-dark mb-3"
                                    onClick={() => { navigate(`/items/${category.name.toLowerCase()}`) }}>Show More
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default Category;