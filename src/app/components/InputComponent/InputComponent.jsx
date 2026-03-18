import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";
function InputComponent({
  label,
  name,
  value,
  type = "text",
  handleChange,
  required,
  errorMessage = "",
  onBlur,
  placeholder,
  id,
  disabled = false,
  onFocus,
  InputButton,
}) {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [inputType, setInputType] = useState("password");
  useEffect(() => {
    setInputType(visible ? "text" : type);
  }, [type, visible]);

  return (
    <div
    // style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div
        className="squared-input-container "
        style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
      >
        <label style={{ padding: "10px" }} id="domain-label">
          {t(label)}
        </label>
        <div style={{ display: "flex" }} className="input-container">
          <input
            style={{ width: InputButton ? "95%" : "100%" }}
            onChange={handleChange}
            type={inputType}
            onBlur={onBlur}
            name={name}
            value={value}
            placeholder={placeholder}
            id={id}
            disabled={disabled}
            onFocus={onFocus}
          />
          {type == "password" ? (
            <div
              style={{
                width: "5%",
                display: "flex",
                justifyContent: "flex-end",
                fontSize: 25,
                padding: 5,
                cursor: "pointer",
              }}
              onClick={() => setVisible(!visible)}
            >
              <i className="fas fa-eye"></i>
            </div>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="error-text">{t(errorMessage)}</div>
        ) : null}
      </div>
    </div>
  );
}

export default InputComponent;
