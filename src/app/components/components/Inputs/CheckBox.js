import React from "react";

import withLabel from "./withLabel";
import { memo } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  styled,
} from "@mui/material";
const Input = ({
  label,
  value = false,
  name,
  handleChange,
  readOnly = false,
}) => {
  const handleChangeFunction = () => (event) => {
    handleChange({ name, value: event.target.checked });
  };

  return (
    <>
      <FormControlLabel
        disabled={readOnly}
        control={
          <Checkbox
            value={name}
            checked={value}
            onChange={handleChangeFunction()}
          />
        }
        label={label}
      />
    </>
  );
};

export default Input;
