import React, { useEffect, useState } from "react";
import RadioGroup from "devextreme-react/radio-group";
import { useTranslation } from "react-i18next";

const RadioGroupList = ({
  data,
  value,
  name,
  layout = "vertical",
  handleChange,
  keys = { id: "Id", name: "Name" },
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <RadioGroup
      id="radio-group-with-selection"
      items={data}
      value={value}
      layout={layout}
      disabled={disabled}
      rtlEnabled={i18n.language === "ar"}
      displayExpr={
        i18n.language === "ar" ? keys.name : keys.nameEn ?? keys.name
      }
      valueExpr={keys.id}
      onValueChanged={(e) => handleChange({ name, value: e.value })}
    />
  );
};

export default RadioGroupList;
