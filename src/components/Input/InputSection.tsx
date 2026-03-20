import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import classes from "./InputSection.module.css";

interface InputSectionProps {
  onAddItem: (articleId: string) => void;
}

export default function InputSection({ onAddItem }: InputSectionProps) {
  const [inputText, setInputText] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = inputText.trim();
    if (trimmed.length < 8) {
      setHasError(true);
      return;
    }

    const artikelNr = trimmed.split(".").join("");
    setIsLoading(true);
    onAddItem(artikelNr);

    setInputText("");
    // Brief loading indicator
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleChange = (value: string) => {
    const trimmed = value.trim();
    setHasError(/[a-zA-Z]/.test(trimmed));
    setInputText(value);
  };

  return (
    <section className={classes.section}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <label htmlFor="articleNumber" className={classes.label}>
          Artikelnummer
        </label>
        <div className={classes.inputRow}>
          <div className={classes.inputWrapper}>
            <Search size={18} className={classes.searchIcon} />
            <input
              id="articleNumber"
              required
              className={`${classes.input} ${hasError ? classes.inputError : ""}`}
              type="text"
              placeholder="404.567.57"
              value={inputText}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <button
            disabled={hasError || isLoading}
            className={classes.button}
            type="submit"
          >
            {isLoading ? (
              <Loader2 size={18} className={classes.spinner} />
            ) : (
              "Hinzufügen"
            )}
          </button>
        </div>
        {hasError && (
          <p className={classes.error}>
            Fehlerhafte Eingabe! Bitte an das Format halten. Es sind keine
            Buchstaben erlaubt!
          </p>
        )}
        {!hasError && (
          <p className={classes.hint}>
            Artikelnummer mit oder ohne Punkte eingeben und mit ENTER oder
            &laquo;Hinzufügen&raquo; bestätigen.
          </p>
        )}
      </form>
    </section>
  );
}
