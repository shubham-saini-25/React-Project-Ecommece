import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ConatcUsImg from '../../images/contactUs.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formBtnStatus, setFormBtnStatus] = useState('Send');

    const validateContactForm = () => {
        return name.length > 0 && email.length > 0 && message.length > 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormBtnStatus('Sending...');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-mail`, {
            method: 'POST',
            body: JSON.stringify({ name, email, message }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response) {
            toast.success("Mail sent succesfully!");
            setName("");
            setEmail("");
            setMessage("");
            setFormBtnStatus('Send');
        }
    }

    return (
        <div className="Contact Card">

            <div className="logo">
                <img src={ConatcUsImg} alt="user" />
            </div>
            <h3 className="text-center mt-4">Contact Us</h3>

            <Form className="p-3 mt-3" autoComplete='off' onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input className="form-control" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input className="form-control" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea className="form-control" name="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                </Form.Group>

                <Button block="true" type="submit" disabled={!validateContactForm()}>{formBtnStatus}</Button>
                <ToastContainer />

            </Form>
        </div>
    );
}

export default ContactForm;