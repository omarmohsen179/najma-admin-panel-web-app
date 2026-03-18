import React from "react";
import { useTranslation } from "react-i18next";

let withLabel = (WrappedComponent, labeled = false) => {
  const withLabel = (props) => {
    let {
      label,
      size,
      requiredInput = false,
      width = "100%",
      labelWidth = "120px",
      important = false,
      disabled = false,
    } = props;
    return (
      <div
        className={(disabled || labeled ? "input-wrapper " : "") + size}
        style={{ gridTemplateColumns: labelWidth + " 1fr" }}
      >
        {label && (
          <div
            className={disabled || labeled ? "label " : ""}
            style={{
              width: width,
              border: important && (disabled || labeled) && "solid red 2px",
            }}
          >
            {label}
            {requiredInput && <b style={{ color: "red" }}>*</b>}
          </div>
        )}
        <WrappedComponent {...props} />
      </div>
    );
  };
  return withLabel;
};
export default withLabel;
