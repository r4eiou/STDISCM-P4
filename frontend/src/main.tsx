import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import { AccountProvider } from "./AccountContext.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import Layout from "./Layout.tsx";
import ViewCourses from "./components/ViewCourses.tsx";
import ViewGrades from "./components/ViewGrades.tsx";
import EnrollCourses from "./components/EnrollCourses.tsx";
import EncodeGrades from "./components/EncodeGrades.tsx";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/view-courses", element: <ViewCourses /> },
      { path: "/view-grades", element: <ViewGrades /> },
      { path: "/enroll-courses", element: <EnrollCourses /> },
      { path: "/encode-grades", element: <EncodeGrades /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AccountProvider>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer position="top-right" autoClose={5000} aria-label="notification"/>
      </AccountProvider>
    </ThemeProvider>
  </StrictMode>
);
