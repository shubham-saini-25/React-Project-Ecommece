import React from 'react';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import ForgetPassword from './components/FogetPassword';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import ContactForm from './components/Contact';
import About from './components/About';
import Item from './components/products/Item';
import HomeNavbar from "./components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import AddToCart from './components/products/AddToCart';
import PaymentForm from './components/PaymentForm';

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