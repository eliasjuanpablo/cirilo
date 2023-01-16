import React, { useCallback, useEffect, useState } from "react";
import { cyrillicToLatinMap } from "./utils";
import "./App.css";

type ErrorTypes = "language" | "wrong";

type ErrorMessageProps = { error: ErrorTypes; nextCorrectLetter: string };

function getRandomElement(options: object) {
  const keys = Object.keys(options);
  return keys[(keys.length * Math.random()) << 0];
}

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
    <div className="bold text-xl">
      <span style={{ color: "green", fontWeight: "800" }}>{done}</span>
      {remaining}
    </div>
  );
}

function App() {
  const [error, setError] = useState<null | ErrorTypes>(null);
  const [words, setWords] = useState<Record<string, string>>({});
  const [currentWord, setCurrentWord] = useState<string>("Сирило");
  const [userInput, setUserInput] = useState("");

  // Next correct letter is the first letter of the remaining part of the word
  const nextCorrectLetter = currentWord.substring(userInput.length).charAt(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const userLetter = e.key;
      const isRelevantKey =
        userLetter !== "Backspace" && !e.altKey && !e.metaKey && !e.ctrlKey;

      // if non-relevant key (i.e. modifier) do nothing
      if (!isRelevantKey) return;

      const latinKey = cyrillicToLatinMap[userLetter];
      if (!latinKey) {
        // User is not writing in russian
        e.preventDefault();
        setError("language");
        return;
      }

      if (userLetter === nextCorrectLetter) {
        // User typed right letter
        setUserInput((prev) => prev + userLetter);
        setError(null);
        return;
      }

      // User typed wrong letter
      setError("wrong");
    },
    [nextCorrectLetter]
  );

  useEffect(() => {
    // Initialize typing event
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Check if user finished current word
    if (userInput === currentWord) {
      setUserInput("");
      setCurrentWord(getRandomElement(words));
    }
  }, [userInput, currentWord, words]);

  useEffect(() => {
    // Fetch and initialize words
    fetch("words.json")
      .then((response) => response.json())
      .then((data) => {
        setWords(data);
        setCurrentWord(getRandomElement(data));
      });
  }, []);

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
          <div className="flex spaced-y mb">
            <div style={{ fontSize: "4rem" }}>Сирило</div>
            <div className="text-l">Practice the cyrillic layout</div>
          </div>
          <div className="flex text-xl spaced-y">
            <div className="">Your word is:</div>
            <WordProgress currentWord={currentWord} userInput={userInput} />
          </div>
          <div style={{ height: "80px" }}>
            {error && (
              <ErrorMessage
                error={error}
                nextCorrectLetter={nextCorrectLetter}
              />
            )}
          </div>
        </div>
      </div>
      <footer className="flex">
        <div className="bold">{new Date().getFullYear()}</div>
        <a
          href="https://github.com/eliasjuanpablo/cirilo"
          target="_blank"
          rel="noreferrer"
        >
          source code
        </a>
      </footer>
    </div>
  );
}

export default App;
