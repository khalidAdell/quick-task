import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout";
import TasksPage from "./pages/TasksPage";
import TaskDetails from "./pages/TaskDetails";
import CreateTaskForm from "./components/CreateTaskForm";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wrapping with Navbar & Footer
    children: [
      { path: "/", element: <Home /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/tasks/:taskId", element: <TaskDetails /> },
      { path: "/post-task", element: <CreateTaskForm /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
