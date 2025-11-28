import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import { AccountProvider } from "./AccountContext.tsx";
import Layout from "./Layout.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccountProvider>
      <RouterProvider router={router}></RouterProvider>
    </AccountProvider>
  </StrictMode>
);
