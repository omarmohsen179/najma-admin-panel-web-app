import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import "./ButtonComponent.css";
import useEnterKeyListener from "./useEnterKeyListener";
const StyledButton = styled(LoadingButton)(({ theme }) => ({
  //  margin: theme.spacing(1),
  margin: "4px 0",
  width: "100%",
}));
const ButtonComponent = ({
  title,
  onClick,
  icon,
  disabled = false,
  useSubmitBehavior = false,
  hint,
  width = "100%",
  loading = false,
  pressOnEnter = false,
  color = "primary",
}) => {
  const { t, i18n } = useTranslation();
  useEnterKeyListener({
    querySelectorToExecuteClick: "submitButton",
    enable: pressOnEnter,
  });

  return (
    <StyledButton
      id={pressOnEnter && "submitButton"}
      variant="contained"
      color={color}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      style={{ fontSize: 15 }}
    >
      {icon && <i className={icon} style={{ padding: 5 }}></i>}
      {t(title)}
    </StyledButton>
  );
};

export default React.memo(ButtonComponent);
