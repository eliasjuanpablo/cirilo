import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <div
          className="flex spaced-y"
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            padding: "2rem 8rem",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "4rem" }}>Сирило</h1>
          <div className="flex text-xl">
            <div className="">Your word is:</div>
            <div className="bold text-l">сирило</div>
          </div>
          <input type="text" />
        </div>
      </div>
    </div>
  );
}

export default App;
