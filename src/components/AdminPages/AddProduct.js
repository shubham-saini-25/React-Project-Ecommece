import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import ItemContext from '../../context/ItemContext';
import axios from 'axios';

const AddProduct = () => {
    const { authUserId } = useContext(ItemContext);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const validateForm = () => {
        return name.length > 0 && description.length > 0 && price.length > 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('price', price);
        formData.append('image', image);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('createdBy', authUserId);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-products`, formData);
            toast.success(res.data.message);
            setName('');
            setCategory('');
            setDescription('');
            setPrice('');
            setImage(null);
            event.target.reset();
        } catch (err) {
            toast.error(err.response.data)
        }
    };

    return (
        <div className='Card d-flex justify-content-center align-items-center' style={{ marginTop: '5rem' }}>
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                    <h3>Add Products</h3>
                </div>
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
                    <Form.Control className='fs-5' as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">--Select a Category--</option>
                        <option value="laptop">Laptops</option>
                        <option value="tablet">Tablets</option>
                        <option value="mobile">Mobiles</option>
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

                <Button block="true" type="submit" disabled={!validateForm()} className='mt-3'>Add Product</Button>

            </Form>
        </div >
    );
}

export default AddProduct;