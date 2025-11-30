import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import { AccountProvider } from "./AccountContext.tsx";
import Layout from "./Layout.tsx";
import ViewCourses from "./components/ViewCourses.tsx";
import ViewGrades from "./components/ViewGrades.tsx";
import EnrollCourses from "./components/EnrollCourses.tsx";
import EncodeGrades from "./components/EncodeGrades.tsx";

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
    <AccountProvider>
      <RouterProvider router={router}></RouterProvider>
    </AccountProvider>
  </StrictMode>
);
