import { memo } from "react";
import { useTranslation } from "react-i18next";
import { DateConvertor, DisplayNumber } from "../DateFunction";

const DisplayText = ({ value, type, warning = false }) => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ color: warning && "red" }}>
      {/* {type == "number" && DisplayNumber(value, i18n)} */}
      {type == "number" && value}
      {type == "date" && DateConvertor(value, i18n)}
      {!type ? value : ""}
    </div>
  );
};

export default memo(DisplayText);
