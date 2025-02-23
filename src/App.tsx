import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
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
import { auth } from "./lib/firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import { JSX, useEffect, useState } from "react";
import EditTaskForm from "./components/EditTaskForm";

// Auth Guard Component
const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="lg:col-span-3 min-h-[70vh] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B860]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Guard Component
const PublicGuard = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="lg:col-span-3 min-h-[70vh] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B860]"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />; // Redirect to home if already authenticated
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/tasks/:taskId", element: <TaskDetails /> },
      {
        path: "/post-task",
        element: (
          <AuthGuard>
            <CreateTaskForm />
          </AuthGuard>
        ),
      },
      {
        path: "/tasks/:taskId/edit",
        element: (
          <AuthGuard>
            <EditTaskForm />
          </AuthGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicGuard>
        <Login />
      </PublicGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicGuard>
        <Register />
      </PublicGuard>
    ),
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
