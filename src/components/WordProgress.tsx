type WordProgressProps = {
  currentWord: string;
  userInput: string;
  meaning: string;
};

export default function WordProgress({
  currentWord,
  userInput,
  meaning,
}: WordProgressProps) {
  const done = currentWord.substring(0, userInput.length);
  const remaining = currentWord.substring(userInput.length);

  return (
    <div className="flex">
      <div className="bold text-xxl" style={{ letterSpacing: "4px" }}>
        <span className="bolder">{done}</span>
        {remaining}
      </div>
      <div className="text-secondary">({meaning})</div>
    </div>
  );
}
