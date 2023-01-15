import React, { useEffect, useState } from "react";
import { cyrillicToLatinMap } from "./utils";
import "./App.css";

function App() {
  const [languageError, setLanguageError] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    const isRelevantKey = e.key !== "Backspace" && !e.altKey && !e.metaKey;
    if (!isRelevantKey) return;

    const latinKey = cyrillicToLatinMap[e.key];
    if (!latinKey) {
      // User is not writing in russian
      e.preventDefault();
      setLanguageError(true);
      return;
    }

    setLanguageError(false);
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div
          className="flex spaced-y"
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            padding: "2rem 8rem",
            borderRadius: "10px",
            borderBottom: "2px solid grey",
            width: "300px",
          }}
        >
          <h1 style={{ fontSize: "4rem" }}>Сирило</h1>
          <div className="flex text-xl">
            <div className="">Your word is:</div>
            <div className="bold text-l">сирило</div>
          </div>
          {languageError && (
            <div className="error">
              Whoops! it seems you are not writing cyrillic...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
