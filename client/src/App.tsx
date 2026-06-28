import { RouterProvider } from "react-router-dom";
import { router } from "./global/routes/router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;