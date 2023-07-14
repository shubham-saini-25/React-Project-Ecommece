import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import { updateUser } from '../../Api/UserApi';

const UpdateUser = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (props.user) {
            const { name, email, phoneNumber } = props.user;
            setName(name);
            setEmail(email);
            setPhoneNumber(phoneNumber);
        }
    }, [props.user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { name, email, phoneNumber, password };

        if (name.length === 0 && email.length === 0 && phoneNumber.length === 0 && password.length === 0) {
            return toast.error('Please enter data for updation');
        }

        try {
            const res = await updateUser(props.user._id, userData);
            toast.success(res.message);
            setName('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            event.target.reset();
        } catch (err) {
            toast.error(err.response)
        }
    }

    return (
        <>
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <Card>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={name}
                                onChange={(e) => setName(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email}
                                onChange={(e) => setEmail(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="tel" placeholder="Enter phone number" value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} size='lg' />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password}
                                onChange={(e) => setPassword(e.target.value)} size='lg' />
                        </Form.Group>

                    </Card.Body>

                    <Card.Footer className='d-flex justify-content-center'>
                        <Button type="submit" onClick={props.closeModal}>Update User</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default UpdateUser;