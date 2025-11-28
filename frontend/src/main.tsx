import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import { AccountProvider } from "./AccountContext.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </StrictMode>
);
