import { RouterProvider } from "react-router-dom";
import { myRouter } from "./Router"
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={myRouter} />
    </LanguageProvider>
  );
}

export default App;
