import classes from "./ItemInput.module.css";
import { useState } from "react";

const ItemInput = (props) => {
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
    <p className={classes.inputDescError}>
      Fehlerhafte Eingabe! Bitte an das Format halten. Es sind keine Buchstaben
      erlaubt!
    </p>
  ) : (
    ""
  );

  return (
    <>
      <h2>Eingabe</h2>
      <hr />
      <form onSubmit={onSubmitHandler} className={classes.inputForm}>
        <label htmlFor="articleID">Artikelnummer</label>
        <input
          id="articleID"
          type="text"
          placeholder="129.123.123 / 129123123"
          value={inputText}
          onChange={onInputChangeHandler}
          className={hasError ? classes.inputError : ""}
        />
        <button disabled={hasError ? true : false} onClick={onSubmitHandler}>
          Hinzufügen
        </button>
        {props.numItems === 0 && (
          <button type="button" onClick={props.loadDemoHandler}>
            Demodaten laden
          </button>
        )}
      </form>
      {errorDesc}
      <p className={classes.inputDescription}>
        Artikelnummer mit oder ohne Punkte eingeben und mit ENTER oder dem
        Button bestätigen.
      </p>
      <p>🟢 = Kauf in Polen ist günstiger</p>
      <p>🔴 = Kauf in Deutschland ist günstiger</p>
    </>
  );
};

export default ItemInput;
