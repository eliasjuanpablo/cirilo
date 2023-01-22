import { useCallback, useEffect, useState } from "react";
import { cyrillicToLatinMap } from "./utils";
import { ErrorTypes } from "./types";
import ErrorMessage from "./components/ErrorMessage";
import Footer from "./components/Footer";
import WordProgress from "./components/WordProgress";
import "./App.css";

function getRandomElement(options: object) {
  const keys = Object.keys(options);
  return keys[(keys.length * Math.random()) << 0];
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
            padding: "2rem 6rem",
            borderRadius: "10px",
            borderBottom: "2px solid grey",
            width: "360px",
          }}
        >
          <div className="flex spaced-y mb">
            <div style={{ fontSize: "4rem" }}>Сирило</div>
            <div className="text-l">Practice the cyrillic layout</div>
          </div>
          <div className="flex text-xl spaced-y">
            <div className="">Type anywhere:</div>
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
      <Footer />
    </div>
  );
}

export default App;
