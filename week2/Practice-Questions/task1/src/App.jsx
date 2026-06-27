import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import ProductCard from "./components/ProductCard";

function App() {
  return (
    <>
      <ProductCard
        image="https://picsum.photos/200"
        name="Wireless Mouse"
        description="Ergonomic wireless mouse."
        price={999}
      />

      <ProductCard
        image="https://picsum.photos/201"
        name="Mechanical Keyboard"
        description="RGB Mechanical Keyboard."
        price={2999}
      />
    </>
  );
}

export default App;