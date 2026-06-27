import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'



function Counter({ title }) {

  const [count, setCount] = useState(0);

  return (
    <div>

      <h2>{title}</h2>

      <h1>{count}</h1>

      <button
        onClick={() => setCount(count + 1)}
      >
        Increase
      </button>

    </div>
  );
}


function App() {
  
  return (
    <>
      <Counter title="Likes" />

<Counter title="Followers" />
    </>
  )
  
}

export default App
