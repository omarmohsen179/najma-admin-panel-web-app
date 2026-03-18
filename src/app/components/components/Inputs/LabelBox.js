import React from "react";
import DisplayText from "../../DisplayText/DisplayText";
import withLabel from "./withLabel";
import { useTranslation } from "react-i18next";

const Input = React.memo(
  ({
    label,
    value,
    type,
    width = "100%",
    background,
    color,
    disabled = true,
  }) => {
    const { t, i18n } = useTranslation();
    return (
      <p
        className="dx-texteditor-input"
        style={{ display: "flex", fontSize: 15 }}
      >
        {type ? <DisplayText value={value} type={type} i18n={i18n} /> : value}
      </p>
    );
  }
);

export default withLabel(Input, true);
