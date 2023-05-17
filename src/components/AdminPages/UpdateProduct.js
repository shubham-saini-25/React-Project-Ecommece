import React, { useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const UpdateProduct = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name.length === 0 && description.length === 0 && price.length === 0) {
            return toast.error('Please enter data for updation');
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-product/${props.itemId}`, formData);
            toast.success(res.data.message);
            window.location.reload();
        } catch (err) {
            toast.error(err.response.data);
        }
    };

    return (
        <Modal.Body>
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
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter your product price" value={price}
                                onChange={(e) => setPrice(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control type="file" placeholder="Enter your email address" accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])} size='lg' />
                        </Form.Group>
                    </Card.Body>

                    <Card.Footer className='d-flex justify-content-center'>
                        <Button type="submit">Update Product</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Modal.Body>
    );
}

export default UpdateProduct;