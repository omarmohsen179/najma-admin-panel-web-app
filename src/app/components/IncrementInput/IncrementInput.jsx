import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import "./index.css";
function IncrementInput({ name, setValues, value }) {
  const { t, i18n } = useTranslation();
  useEffect(() => {}, []);

  return (
    <div>
      <div className="quantity">
        <div
          href="#"
          className="quantity__minus noselect"
          onClick={() => setValues(value - 1)}
        >
          <span>-</span>
        </div>
        <input
          // name="quantity"
          type="text"
          className="quantity__input"
          name={name}
          value={value}
          // onChange={handleChange}
          onChange={(e) => setValues(e.target.value)}
        />
        <div
          href="#"
          className="quantity__plus noselect"
          onClick={() => setValues(value + 1)}
        >
          <span>+</span>
        </div>
      </div>
    </div>
  );
}

export default IncrementInput;
