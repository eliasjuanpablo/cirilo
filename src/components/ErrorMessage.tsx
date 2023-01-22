import { ErrorTypes } from "../types";
import { cyrillicToLatinMap } from "../utils";

type ErrorMessageProps = { error: ErrorTypes; nextCorrectLetter: string };

export default function ErrorMessage({
  error,
  nextCorrectLetter,
}: ErrorMessageProps) {
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
