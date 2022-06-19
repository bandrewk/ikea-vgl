import classes from "./Input.module.css";
import { useState } from "react";

const Input = (props) => {
  const [inputText, setInputText] = useState("");
  const [hasError, setHasError] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Last validity check
    if (inputText.trim().length < 8) {
      setHasError(true);
      return;
    }

    const artikelNr = inputText.trim().split(".").join("");

    props.addItemHandler(artikelNr);

    setInputText("");
  };

  const onInputChangeHandler = (event) => {
    // Remove whitespaces
    const value = event.target.value.trim();

    // Check for letters
    if (/[a-zA-Z]/g.test(value)) {
      setHasError(true);
    } else setHasError(false);

    setInputText(value);
  };

  const errorDesc = hasError ? (
    <p className={`${classes.inputDesc} ${classes.error}`}>
      Fehlerhafte Eingabe! Bitte an das Format halten. Es sind keine Buchstaben
      erlaubt!
    </p>
  ) : (
    ""
  );

  return (
    <section className={classes["section-input"]}>
      <div className="container">
        <form onSubmit={onSubmitHandler}>
          <label for="articleNumber" className="heading-tertiary">
            Artikelnummer
          </label>

          <input
            id="articleNumber"
            required
            className={`${classes["input-articleNumber"]} ${
              hasError ? `${classes.error}` : ``
            }`}
            type="text"
            placeholder="404.567.57"
            value={inputText}
            onChange={onInputChangeHandler}
            a
          />
          <button
            disabled={hasError ? true : false}
            className={classes["btn-primary"]}
          >
            Hinzufügen
          </button>
        </form>
        {errorDesc}
        {!hasError && (
          <p className={classes.inputDesc}>
            Artikelnummer mit oder ohne Punkte eingeben und mit ENTER oder
            `Hinzufügen` bestätigen.
          </p>
        )}
      </div>
    </section>
  );
};

export default Input;
