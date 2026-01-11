import { RouterProvider } from "react-router-dom";
import { myRouter } from "../../Crea/src/Router";

function App() {
  return <RouterProvider router={myRouter} />;
}

export default App;
