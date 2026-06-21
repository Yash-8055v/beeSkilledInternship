import { useState } from "react";
import './components.css'

function Form() {
  const [name, setName] = useState("");

  return (
    <div className="form-box">
      <h2>Contact Form</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Hello, {name}</p>
    </div>
  );
}

export default Form;