import React, { useCallback, useEffect, useState } from "react";
import { cyrillicToLatinMap } from "./utils";
import "./App.css";

type ErrorTypes = "language" | "wrong";

type ErrorMessageProps = { error: ErrorTypes; nextCorrectLetter: string };

function ErrorMessage({ error, nextCorrectLetter }: ErrorMessageProps) {
  if (error === "language")
    return (
      <div className="error">
        Whoops! it seems you are not writing cyrillic...
      </div>
    );
  return (
    <div>
      Mmmh, try with{" "}
      <span className="suggested-key">
        {cyrillicToLatinMap[nextCorrectLetter]}
      </span>
    </div>
  );
}

type WordProgressProps = {
  currentWord: string;
  userInput: string;
};

function WordProgress({ currentWord, userInput }: WordProgressProps) {
  const done = currentWord.substring(0, userInput.length);
  const remaining = currentWord.substring(userInput.length);
  return (
    <div className="bold text-l">
      <span style={{ color: "red", fontWeight: "800" }}>{done}</span>
      {remaining}
    </div>
  );
}

function App() {
  const [error, setError] = useState<null | ErrorTypes>(null);
  const [currentWord, setCurrentWord] = useState("сирило");
  const [userInput, setUserInput] = useState("");

  // Next correct letter is the first letter of the remaining part of the word
  const nextCorrectLetter = currentWord.split(userInput || " ").slice(-1)[0][0];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const userLetter = e.key;
      const isRelevantKey =
        userLetter !== "Backspace" && !e.altKey && !e.metaKey;
      if (!isRelevantKey) return;

      const latinKey = cyrillicToLatinMap[userLetter];
      if (!latinKey) {
        // User is not writing in russian
        e.preventDefault();
        setError("language");
        return;
      }

      if (userLetter === nextCorrectLetter) {
        setUserInput((prev) => prev + userLetter);
        setError(null);
        return;
      }

      setError("wrong");
    },
    [nextCorrectLetter]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (userInput === currentWord) {
      setUserInput("");
    }
  }, [userInput, currentWord]);

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
            <WordProgress currentWord={currentWord} userInput={userInput} />
          </div>
          {error && (
            <ErrorMessage error={error} nextCorrectLetter={nextCorrectLetter} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
