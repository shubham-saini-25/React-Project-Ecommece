import React from 'react';
import App from './App';
import About from './components/main/About';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomeNavbar from './components/main/Navbar';
import ContactForm from './components/main/Contact';
import Products from './components/products/Products';
import AddToCart from './components/products/AddToCart';
import ForgetPassword from './components/Auth/FogetPassword';
import ViewCategory from './components/AdminPages/ViewCategory';
import ViewProducts from './components/AdminPages/ViewProducts';
import PaymentInvoice from './components/payment/PaymentInvoice';
import AdminHomePage from './components/AdminPages/AdminHomePage';
import ViewCustomers from './components/AdminPages/ViewCustomers';
import CustomerOrders from './components/products/CustomerOrders';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Routing = () => {
    return (
        <Router>
            <HomeNavbar />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/admin/home" element={<AdminHomePage />} />
                <Route path="/admin/view-category" element={<ViewCategory />} />
                <Route path="/admin/view-products" element={<ViewProducts />} />
                <Route path="/admin/view-customers" element={<ViewCustomers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contactUs" element={<ContactForm />} />
                <Route path="/cart-items" element={<AddToCart />} />
                <Route path="/my-orders" element={<CustomerOrders />} />
                <Route path="/payment-invoice" element={<PaymentInvoice />} />
                <Route path="items/:items" element={<Products />} />
            </Routes>
        </Router>
    );
};

export default Routing;