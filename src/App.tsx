import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const Router = process.env.NODE_ENV === "test" ? MemoryRouter : BrowserRouter;
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
