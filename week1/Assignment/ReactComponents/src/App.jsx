import "./App.css";
import "./components/components.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Button from "./components/Button";
import Form from "./components/Form";

function App() {
  return (
    <>
      <Header />

      <div className="container">
        <h1>React Components Practice</h1>

        <div className="card-container">

          <Card
            title="Portfolio Website"
            description="Responsive website built using HTML and CSS."
          />

          <Card
            title="Smoke Detector"
            description="IoT project using ESP8266 and Telegram alerts."
          />

          <Card
            title="Movie App"
            description="Movie browsing application built using React."
          />

        </div>

        <div className="button-section">
          <Button text="Download Resume" />
        </div>

        <div className="form-section">
          <Form />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;