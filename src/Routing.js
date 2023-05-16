import React from 'react';
import App from './App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgetPassword from './components/Auth/FogetPassword';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import ContactForm from './components/main/Contact';
import About from './components/main/About';
import Item from './components/products/Item';
import HomeNavbar from "./components/main/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import AddToCart from './components/products/AddToCart';
import PaymentInvoice from './components/payment/PaymentInvoice';
import AddProduct from './components/AdminPages/AddProduct';
import AdminProducts from './components/AdminPages/AdminProducts';
import EditProduct from './components/AdminPages/EditProduct';

// const Routing = () => {
//     <BrowserRouter>
//         <Routes>
//             <Route path='/' element={<App />}></Route>
//             <Route path='/login' element={<Login />}></Route>
//             <Route path='/register' element={<Register />}></Route>
//             <Route path='/forget-password' element={<ForgetPassword />}></Route>
//             <Route path='/about' element={<About />}></Route>
//             <Route path='/contactUs' element={<ContactForm />}></Route>
//             <Route path='/items/:items' element={<Item />}></Route>
//         </Routes>
//     </BrowserRouter>
// };

// export default Routing;

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <App />
        ),
    },
    {
        path: "/login",
        element: (
            <Login />
        ),
    },
    {
        path: "/forget-password",
        element: (
            <ForgetPassword />
        ),
    },
    {
        path: "/register",
        element: (
            <Register />
        ),
    },
    {
        path: "/about",
        element: (
            <About />
        ),
    },
    {
        path: "/contactUs",
        element: (
            <ContactForm />
        ),
    },
    {
        path: "/cart-items",
        element: (
            <AddToCart />
        ),
    },
    {
        path: "/payment-done",
        element: (
            <PaymentInvoice />
        ),
    },
    {
        path: "/add-products",
        element: (
            <AddProduct />
        ),
    },
    {
        path: "/edit-products",
        element: (
            <EditProduct />
        ),
    },
    {
        path: "/get-products",
        element: (
            <AdminProducts />
        ),
    },
    {
        path: "items/:items",
        element: (
            <Item />
        ),
    },
]);

const Routing = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default Routing;