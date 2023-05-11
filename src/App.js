import React, { useEffect, useState } from 'react';
import { HomeProducts } from './constants/data';
import Products from './components/Products';
import { Row } from 'react-bootstrap';
import Home from './components/Home';
import './App.css';

function App() {
  const [Product, setProduct] = useState([]);

  useEffect(() => {
    setProduct(HomeProducts);
  }, []);

  return (
    <div className="App">
      <section id='home'>
        <Home />
      </section>
      <section id='products'>
        <Row style={{ marginLeft: "auto", marginRight: 'auto' }} >
          {Product.map((item, idx) => {
            return (
              <Products key={idx} product={item} />
            )
          })}
        </Row>
      </section>
      <br />
    </div>
  );
}

export default App;
