import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "react-use-cart";
import ItemState from './context/ItemState';
import Routing from './Routing';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ItemState>
    <CartProvider>
      <Routing />
    </CartProvider>
  </ItemState>
);
