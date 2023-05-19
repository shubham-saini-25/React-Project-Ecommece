import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useCart } from 'react-use-cart';
import Swal from 'sweetalert2';

const PaymentInvoice = () => {
    Swal.fire('Payment done successfully!', 'Thank you for your purchase!', 'success');
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const { items, cartTotal } = useCart();
    const [customerInfo, setCustomerInfo] = useState({});
    const [shippingCharges, setShippingCharges] = useState(0);
    const [sendEmailBtnText, setSendEmailBtnText] = useState('Send');
    const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');

    let today = new Date();
    let dateTime = today.toLocaleString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true
    });

    useEffect(() => {
        let randomInvoiceNumber = Math.floor(Math.random() * 99999999);
        setInvoiceNumber(randomInvoiceNumber);

        if (cartTotal < 500) {
            setShippingCharges(99);
        } else {
            setShippingCharges(0);
        }

        const fetchCustomerDetails = async () => {
            try {
                // Load the Stripe SDK with your publishable key
                const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

                // Retrieve the payment intent from the Stripe API
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                // Access the Customer and Shipping details from the payment intent
                const customer = paymentIntent.shipping;
                const customerDetails = {
                    name: customer.name,
                    email: paymentIntent.receipt_email,
                    phone: customer.phone,
                    line1: customer.address.line1,
                    line2: customer.address.line2,
                    city: customer.address.city,
                    state: customer.address.state,
                    country: customer.address.country,
                    postal_code: customer.address.postal_code,
                };

                setEmail(customerDetails.email);
                setCustomerInfo({
                    customerDetails, items, 'invoiceNumber': randomInvoiceNumber,
                    shippingCharges, cartTotal, dateTime,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchCustomerDetails();
    }, [paymentIntentId]);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false)
    };

    const invoiceDownload = () => {
        Swal.fire('Invoice Downloaded Successfully!', 'Thank you for your purchase!', 'success');
    }

    const sentInvoiceOnEmail = async () => {
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        setSendEmailBtnText('Sending...');

        if (isValidEmail) {
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/send-invoice`;
                const headers = { "Content-Type": "application/json" };
                const res = await axios.post(url, customerInfo, { headers: headers });
                toast.success(res.data.message);
                setSendEmailBtnText('Send');
            } catch (err) {
                toast.error(err.response.data);
            }
            // toast.success('Invoice successfully sent to your email');
            // handleHide();
        } else {
            toast.error('Please enter a valid email');
            setSendEmailBtnText('Send');
        }
    }

    return (
        <>
            <ToastContainer />
            <Container>
                <div className='invoice mt-5 text-center'>
                    <div className='header'>
                        <h1 className='text-center pt-3'>Order Invoice</h1>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='col-sm-7 fw-bold'>
                            <p>Invoice Number: #{invoiceNumber}</p>
                            <p>Date: {dateTime}</p>
                        </div>
                        <div className='col-sm-5'>
                            <img src="data:image/jpeg;base64,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" alt="" width={220} />
                        </div>
                    </div>
                    <hr />
                    <div className="table-responsive d-flex justify-content-center align-middle">
                        <table className="table table-bordered align-middle w-75">
                            <thead>
                                <tr className='fs-4'>
                                    <th>Bill from:</th>
                                    <th>Bill to:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>HestaBit Technologies</td>
                                    <td>{customerInfo.name}</td>
                                </tr>
                                <tr>
                                    <td>shubham@gmail.com</td>
                                    <td>{customerInfo.email}</td>
                                </tr>
                                <tr>
                                    <td>Sector 63, Noida, India</td>
                                    <td>
                                        {customerInfo.line1}, {customerInfo.line2}, <br />
                                        {customerInfo.city}, {customerInfo.state}, {customerInfo.country},
                                        {customerInfo.postal_code}
                                    </td>
                                </tr>
                                <tr>
                                    <td>+919090909090</td>
                                    <td>{customerInfo.phone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-responsive d-flex justify-content-center">
                        <table className="table table-bordered w-75">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <table className="table table-bordered w-50">
                            <thead>
                                <tr>
                                    <th>Sub Total:</th>
                                    <th>${cartTotal}</th>
                                </tr>
                                <tr>
                                    <th>Shipping:</th>
                                    <th>{shippingCharges > 0 ? `$${shippingCharges.toFixed(2)}` : 'Free'}</th>
                                </tr>
                                <tr>
                                    <th>Total:</th>
                                    <th>${(cartTotal + shippingCharges).toFixed(2)}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-center '>
                        <a className='btn btn-info mb-3' href="path/to/file.ext" download={`invoice_#${invoiceNumber}.pdf`}
                            onClick={invoiceDownload}><i className="fa fa-download" aria-hidden="true"></i>
                            &nbsp;Downlaod Invoice
                        </a>
                        &emsp;
                        <Button className='btn btn-warning mb-3' onClick={handleShow}>
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            &nbsp;Send Invoice on Email
                        </Button>
                    </div>
                </div>
            </Container>

            <Modal size="md" show={show} onHide={handleHide} centered>
                <Modal.Header closeButton onClick={handleHide}>
                    <Modal.Title>Sent Invoice on Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer Email</Form.Label>
                            <Form.Control type="text" placeholder="Enter your email address" value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <div className='d-flex justify-content-center'>
                            <Button onClick={sentInvoiceOnEmail}>{sendEmailBtnText}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PaymentInvoice;