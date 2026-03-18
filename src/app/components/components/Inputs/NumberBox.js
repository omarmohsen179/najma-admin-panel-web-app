import React, { useEffect, useMemo, useState } from "react";
import {
  NumberBox,
  Button as NumberBoxButton,
} from "devextreme-react/number-box";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import DisplayText from "../../DisplayText/DisplayText";

const Input = React.memo(
  ({
    children,
    label,
    name,
    value = "",
    handleChange,
    size = "col-12",
    required = true,
    readOnly = false,
    placeholder = "",
    validationErrorMessage,
    valid = true,
    buttonOptions,
    ref,
    nonNegative = false,
    cssClass,
    disabled,
    onFocusOut,
    max = 1000000000000,
    min = -1000000000000,
  }) => {
    const { t, i18n } = useTranslation();
    // useEffect(() => {
    //   if (isNaN(value)) handleChange && handleChange({ name, value: 0 });
    //   return () => {};
    // }, [value]);

    return !disabled ? (
      <NumberBox
        ref={ref}
        onFocusOut={onFocusOut}
        validationMessageMode="auto"
        validationStatus={validationErrorMessage ? "invalid" : "valid"}
        validationError={{ message: validationErrorMessage }}
        placeholder={placeholder}
        readOnly={readOnly}
        max={max}
        min={min}
        disabled={disabled}
        // rtlEnabled={true}
        style={{ height: "38px" }}
        value={parseFloat(value)}
        name={name}
        onInput={({ event }) => {
          if (nonNegative && event.target.value.includes("-")) {
            handleChange({ name, value: 0 });
          } else {
            handleChange({
              name,
              value: event.target.value !== "" ? +event.target.value : 0,
            });
          }
        }}
        className={cssClass + (!valid && " cell-error")}
      >
        {buttonOptions && (
          <NumberBoxButton
            name={name}
            location="before"
            options={buttonOptions}
          />
        )}
        {required && (
          <Validator>
            <RequiredRule message={t("This Input is Required")} />
          </Validator>
        )}
      </NumberBox>
    ) : (
      <p
        className="dx-texteditor-input"
        style={{
          // fontSize: "18px",
          display: "flex",
          alignItems: "center",
          // background: background,
          // color: color,
        }}
      >
        <DisplayText value={value} type={"number"} i18n={i18n} />
      </p>
    );
  }
);

export default withLabel(Input);
