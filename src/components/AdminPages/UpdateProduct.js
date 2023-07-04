import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const UpdateProduct = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const categoryList = Object.values(props.category);

    useEffect(() => {
        if (props.product) {
            const { name, description, category, price } = props.product;
            setName(name);
            setDescription(description);
            setCategory(category)
            setPrice(price);
        }
    }, [props.product]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name.length === 0 && description.length === 0 && price.length === 0 && image === null) {
            return toast.error('Please enter data for updation');
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('image', image);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-product/${props.product._id}`, formData);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    return (
        <>
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <Card>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your product name" value={name}
                                onChange={(e) => setName(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter your product description" value={description}
                                onChange={(e) => setDescription(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Category</Form.Label>
                            <Form.Control className='fs-5' as="select" value={category} onChange={(e) => setCategory(e.target.value)} >
                                <option value="">--Select a Category--</option>
                                {categoryList.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter your product price" value={price}
                                onChange={(e) => setPrice(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} size='lg' />
                        </Form.Group>
                    </Card.Body>

                    <Card.Footer className='d-flex justify-content-center'>
                        <Button type="submit" onClick={props.closeModal}>Update Product</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default UpdateProduct;