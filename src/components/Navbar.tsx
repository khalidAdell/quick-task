import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  message: string;
  taskId: string;
  timestamp: Date;
  read: boolean;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Fetch notifications
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid)
        );

        const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
          const notificationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
          })) as Notification[];
          setNotifications(notificationsData);
        });

        return () => unsubscribeNotifications();
      } else {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate("/login"); // Navigate to login after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-white shadow-sm border-b border-[#f4b860]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-[#F4B860] hover:text-[#e3a24f] transition"
          >
            QuickTask
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                  ${
                    isActive ? "text-[#F4B860] border-b-2 border-[#F4B860]" : ""
                  }`
                }
              >
                Browse Tasks
              </NavLink>
              {user && (
                <NavLink
                  to="/post-task"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-[#F4B860] transition-all font-medium
                    ${
                      isActive
                        ? "text-[#F4B860] border-b-2 border-[#F4B860]"
                        : ""
                    }`
                  }
                >
                  Post Task
                </NavLink>
              )}
            </div>

            {/* Auth Buttons & Notifications */}
            <div className="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
              {user ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="text-gray-600 hover:text-[#F4B860] relative"
                    >
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-64 z-50 bg-white rounded-lg shadow-lg border">
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">Notifications</h3>
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <Link
                                key={notification.id}
                                to={`/tasks/${notification.taskId}`}
                                onClick={() => {
                                  markNotificationAsRead(notification.id);
                                  setShowNotifications(false);
                                }}
                                className="block p-2 hover:bg-gray-100 rounded"
                              >
                                <div className="text-sm">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDistanceToNow(notification.timestamp)}{" "}
                                  ago
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">
                              No new notifications
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-[#F4B860] flex items-center gap-2 group"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-1 border-white shadow-lg"
                      />
                    ) : (
                      <FaUserCircle className="text-xl" />
                    )}
                    <span className="font-medium">
                      {user.displayName || "Profile"}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-[#F4B860] hover:bg-[#e3a24f] text-white px-5 py-2.5 rounded-lg 
                      font-medium transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-[#F4B860] flex items-center gap-2 group"
                  >
                    <FaUserCircle className="text-xl" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#F4B860] hover:bg-[#e3a24f] text-white px-5 py-2.5 rounded-lg 
                      font-medium transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#F4B860] hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg z-50 left-0 right-0">
            <div className="px-4 pt-2 pb-6 space-y-4">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="/tasks"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
              >
                Browse Tasks
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/post-task"
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-600 hover:text-[#F4B860] py-2 font-medium"
                  >
                    Post Task
                  </NavLink>
                </>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center bg-[#F4B860] hover:bg-[#e3a24f] text-white py-2.5 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center text-gray-600 hover:text-[#F4B860] py-2 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-[#F4B860] hover:bg-[#e3a24f] text-white py-2.5 rounded-lg font-medium"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
