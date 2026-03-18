import { ThemeProvider } from '@mui/material';
import useSettings from 'app/hooks/useSettings';

const SidenavTheme = ({ children }) => {
  const { settings } = useSettings();
  const sidenavTheme = settings.themes[settings.layout1Settings.leftSidebar.theme];

  return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>;
};
export default SidenavTheme;
