import React, { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import ItemContext from '../../context/ItemContext';
import { addProduct } from '../../Api/ProductApi';

const AddProduct = (props) => {
    const { authUserId } = useContext(ItemContext);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const categoryList = Object.values(props.category);
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
            const result = await addProduct(formData);
            toast.success(result.message);
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
                        <Button type="submit" disabled={!validateForm()} onClick={props.closeModal}>Add Product</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default AddProduct;