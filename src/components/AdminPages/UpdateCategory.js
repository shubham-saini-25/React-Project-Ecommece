import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const UpdateCategory = (props) => {
    const [name, setName] = useState(props.category.name);
    const [image, setImage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name.length === 0 && image === null) {
            return toast.error('Please enter data for updation');
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('image', image);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-category/${props.category._id}`, formData);
            toast.success(res.data.message);
            setName('');
            setImage(null);
            event.target.reset();
        } catch (err) {
            toast.error(err.response.data)
        }
    };

    return (
        <>
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <Card>
                    <Card.Body>
                        <Form.Group className="mb-4">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a category name" value={name}
                                onChange={(e) => setName(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Category Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} size='lg' />
                        </Form.Group>
                    </Card.Body>

                    <Card.Footer className='d-flex justify-content-center'>
                        <Button type="submit" onClick={props.closeModal}>Update Category</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default UpdateCategory;