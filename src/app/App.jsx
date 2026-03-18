import { CssBaseline } from "@mui/material";
import { useRoutes } from "react-router-dom";
import { MatxTheme } from "./components";
import { AuthProvider } from "./contexts/JWTAuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import "devextreme/dist/css/dx.light.css";
/*import "../fake-db";*/
import { LanguageProvider } from "./services/LanguageContext";
import { pages } from "./navigations";
import "./App.css";
const App = () => {
  const content = useRoutes(pages);
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AuthProvider>
          <MatxTheme>
            <CssBaseline />
            {content}
          </MatxTheme>
        </AuthProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
};

export default App;
