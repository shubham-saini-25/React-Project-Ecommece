import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import ItemContext from '../../context/ItemContext';
import { saveOrder } from '../../Api/OrderApi';
import { sendInvoice } from '../../Api/Email';
import { useCart } from 'react-use-cart';
import html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';

const PaymentInvoice = () => {
    const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({});
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const { authUserId, shippingCharges } = useContext(ItemContext);
    const [sendEmailBtnText, setSendEmailBtnText] = useState('Send');
    const { emptyCart } = useCart();

    let today = new Date();
    let dateTime = today.toLocaleString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true
    });

    let date = dateTime.split("at")[0];
    let time = dateTime.split("at")[1];

    useEffect(() => {
        Swal.fire('Payment done successfully!', 'Thank you for your purchase!', 'success');

        let randomInvoiceNumber = Date.now();
        setInvoiceNumber(randomInvoiceNumber);

        const items = localStorage.getItem('cartItems');
        const itemsTotal = localStorage.getItem('cartTotal');
        setCartItems(JSON.parse(items));
        setCartTotal(parseInt(itemsTotal));

        const saveOrderDetails = async () => {
            const orderDetails = {
                "order": JSON.parse(items),
                "userId": authUserId,
                "paymentIntentId": paymentIntentId
            };

            // save the order details after the successful payment
            try {
                await saveOrder(orderDetails);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCustomerDetails = async () => {
            try {
                // Load the Stripe SDK with your publishable key
                const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

                // Retrieve the payment intent from the Stripe API
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                if (paymentIntent.status === 'succeeded') {
                    emptyCart();
                }

                // Access the Customer and Shipping details from the payment intent
                const customer = await paymentIntent.shipping;
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
                console.error(error);
            }
        };
        fetchCustomerDetails();
        saveOrderDetails();
    }, [authUserId, cartTotal, shippingCharges]);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false)
    };

    const invoiceDownload = () => {
        const element = document.getElementById('pdf-content');
        html2pdf().from(element).save(`${invoiceNumber}.pdf`);
        Swal.fire('Invoice Downloaded Successfully!', 'Thank you for your purchase!', 'success');
    }

    const sentInvoiceOnEmail = async () => {
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        setSendEmailBtnText('Sending...');

        if (isValidEmail) {
            try {
                const response = await sendInvoice(customerInfo);
                toast.success(response.message);
                setSendEmailBtnText('Send');
                handleHide();
            } catch (err) {
                toast.error(err.response.data);
            }
        } else {
            toast.error('Please enter a valid email');
            setSendEmailBtnText('Send');
        }
    }

    return (
        <>
            <ToastContainer />
            <Container>
                <div className='d-flex justify-content-center'>
                    <Button className='btn btn-info mt-4' onClick={invoiceDownload}>
                        <i className="fa fa-download" aria-hidden="true"></i>
                        &nbsp;Downlaod Invoice
                    </Button>
                    &emsp;
                    <Button className='btn btn-warning mt-4' onClick={handleShow}>
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                        &nbsp;Send Invoice on Email
                    </Button>
                </div>
                <div className="container-fluid my-4 d-flex justify-content-center">
                    <div id="pdf-content">
                        <div className="card card-1">
                            <div className="card-header bg-white">
                                <h2 className="text-center mt-2 mb-2">Order Invoice</h2>
                                <div className="row mt-5">
                                    <div className="col" style={{ textAlign: 'left' }}>
                                        <div className="col-auto">
                                            <p className="mb-1 text-dark"><b>Order Details</b></p>
                                        </div>
                                        <p className="mb-1">
                                            Invoice Number: {invoiceNumber}
                                        </p>
                                        <p className="mb-1">
                                            Invoice Date: {date}
                                        </p>
                                        <p className="mb-1">
                                            Invoice Time: {time}
                                        </p>
                                    </div>
                                    <div className="col" style={{ textAlign: 'right' }}>
                                        <div className="col-auto">
                                            <p className="mb-1 text-dark"><b>Shipping Details</b></p>
                                        </div>
                                        <p className="mb-1">
                                            {customerInfo.customerDetails?.line1}, {customerInfo.customerDetails?.line2}
                                        </p>
                                        <p className="mb-1">
                                            {customerInfo.customerDetails?.city}, {customerInfo.customerDetails?.state},
                                            {customerInfo.customerDetails?.country}, {customerInfo.customerDetails?.postal_code}
                                        </p>
                                    </div>
                                </div>
                                <div className="media flex-sm-row flex-column-reverse justify-content-between">
                                    <div className="col my-auto mt-4">
                                        <h5 className="mb-3 text-center">Thanks for your Order,
                                            <b className="text-primary">
                                                &nbsp;{customerInfo.customerDetails?.name}
                                            </b> !
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="card card-2">
                                            <div className="card-body">
                                                <div className="row flex-column flex-md-row text-center">
                                                    <div className="col">
                                                        <h6 className="fw-bold">Item</h6>
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="fw-bold">Quantity</h6>
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="fw-bold">Price</h6>
                                                    </div>
                                                    <div className="col">
                                                        <h6 className="fw-bold">Total</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {cartItems.map((item, idx) => (
                                    <div className="row mt-2" key={idx}>
                                        <div className="col">
                                            <div className="card card-2">
                                                <div className="card-body">
                                                    <div className="row flex-column flex-md-row text-center">
                                                        <div className="col">
                                                            <h6>{item.name}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <h6>{item.quantity}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <h6>${item.price.toFixed(2)}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <h6>${item.itemTotal.toFixed(2)}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <div className="row mt-4">
                                    <div className="col">
                                        <div className="row justify-content-start">
                                            <div className="col-auto my-auto">
                                                <p className="mb-0"><b>Customer Details</b></p>
                                            </div>
                                        </div>
                                        <div className="row justify-content-start">
                                            <div className="col-auto mt-1 my-auto">
                                                <p className="mb-0">Email: {customerInfo.customerDetails?.email}</p>
                                            </div>
                                        </div>
                                        <div className="row justify-content-start">
                                            <div className="col-auto ml-auto">
                                                <p className="mb-0">Contact: {customerInfo.customerDetails?.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <br />
                                        <div className="row justify-content-end">
                                            <div className="col-auto my-auto">
                                                <p className="mb-0"><b>Sub Total:</b> ${cartTotal.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="row justify-content-end">
                                            <div className="col-auto ml-auto">
                                                <p className="mb-0"><b>Delivery Charges:</b> {shippingCharges > 0 ? `$${shippingCharges.toFixed(2)}` : 'Free'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="jumbotron-fluid">
                                    <div className="row justify-content-center">
                                        <div className="col-auto my-auto">
                                            <h3 className="mb-0 font-weight-bold">TOTAL PAID AMOUNT: </h3>
                                        </div>
                                        <div className="col-auto mt-2 ml-auto">
                                            <h1 className="fs-3">
                                                <b className="text-primary">${(cartTotal + shippingCharges).toFixed(2)}</b>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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