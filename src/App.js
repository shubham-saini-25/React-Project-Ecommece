import React from 'react';
import Category from './components/products/Category';
import Footer from './components/main/Footer';
import Home from './components/main/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <section id='home'>
        <Home />
      </section>
      <section id='products'>
        <Category />
      </section>
      <br />
      <Footer />
    </div>
  );
}

export default App;
