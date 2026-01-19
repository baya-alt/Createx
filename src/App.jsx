import { RouterProvider } from "react-router-dom";
import { myRouter } from "../../Crea/src/Router";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={myRouter} />
    </LanguageProvider>
  );
}

export default App;
