import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './Routing';
import App from './App';
import HomeNavbar from './components/main/Navbar';
import 'font-awesome/css/font-awesome.min.css';
import ItemState from './context/ItemState';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from "react-use-cart";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ItemState>
    <CartProvider>
      <BrowserRouter>
        <HomeNavbar />
      </BrowserRouter>
      <Routing />
    </CartProvider>
  </ItemState>
);
