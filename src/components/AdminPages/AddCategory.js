import React, { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import ItemContext from '../../context/ItemContext';
import { addCategory } from '../../Api/CategoryApi';

const AddCategory = (props) => {
    const { authUserId } = useContext(ItemContext);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);

    const validateForm = () => {
        return name.length > 0 && image !== null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('image', image);
        formData.append('createdBy', authUserId);

        try {
            const result = await addCategory(formData);
            toast.success(result.message);
            setImage(null);
            setName('');
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
                        <Button type="submit" disabled={!validateForm()} onClick={props.closeModal}>Add Category</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default AddCategory;