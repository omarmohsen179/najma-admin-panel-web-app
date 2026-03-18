import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Dialog as DialogMui, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { H6 } from "app/components/Typography";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Dialog({
  children,
  title,
  visible,
  fullWidth = false,
  height = 500,
  close,
  loading = false,
  full = false,
  showTitle = true,
  scrolling = true,
}) {
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener

  return (
    <DialogMui
      fullScreen={full}
      open={visible}
      onClose={close}
      TransitionComponent={Transition}
      fullWidth={fullWidth}
      style={{ minWidth: 300 }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={close}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>

          <H6 sx={{ flex: 1, marginLeft: theme.spacing(2) }}>{t(title)}</H6>
        </Toolbar>
      </AppBar>
      {loading ? (
        <CircularProgress color="inherit" style={{ margin: "auto" }} />
      ) : (
        <div
          style={{
            direction: i18n.language == "en" ? "ltr" : "rtl",
            maxHeight: "100vh",

            overflow: scrolling ? "auto" : "hidden",
          }}
        >
          {children}
        </div>
      )}
    </DialogMui>
  );
}
export default Dialog;
