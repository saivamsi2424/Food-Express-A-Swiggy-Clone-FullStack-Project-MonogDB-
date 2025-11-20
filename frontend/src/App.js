import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import UserHome from "./components/UserHome";
import VendorHome from "./components/VendorHome";
import VendorOrders from "./components/VendorOrders";
import UserOrders from "./components/UserOrders";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import Favourites from "./components/Favourites";

function AppWrapper() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [initialized, setInitialized] = useState(false);

  // --------------------------------------------
  // ⭐ Auto-login logic (runs only ONCE)
  // --------------------------------------------
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (storedName && storedRole) {
      setUserName(storedName);
      setRole(storedRole);

      // Redirect ONLY if coming from root (login page)
      if (
        window.location.pathname === "/" ||
        window.location.pathname === ""
      ) {
        if (storedRole === "vendor") navigate("/vendor");
        else navigate("/home");
      }
    }

    setInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialized) return null; // avoid flicker

  // --------------------------------------------
  // ⭐ Handle Login
  // --------------------------------------------
  const handleLogin = (selectedRole, name) => {
    setRole(selectedRole);
    setUserName(name);

    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", selectedRole);

    if (selectedRole === "vendor") navigate("/vendor");
    else navigate("/home");
  };

  // --------------------------------------------
  // ⭐ Logout
  // --------------------------------------------
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setUserName("");
      setRole("");
      navigate("/");
    }
  };

  // --------------------------------------------
  // ⭐ Route Protection Components
  // --------------------------------------------

  const PrivateRoute = ({ children }) => {
    return userName ? children : <Navigate to="/" replace />;
  };

  const VendorRoute = ({ children }) => {
    return role === "vendor" ? children : <Navigate to="/" replace />;
  };

  const UserRoute = ({ children }) => {
    return role === "user" ? children : <Navigate to="/" replace />;
  };

  // --------------------------------------------
  // ⭐ Routing Table
  // --------------------------------------------

  return (
    <Routes>
      {/* LOGIN PAGE */}
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

      {/* USER ROUTES */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <UserRoute>
              <UserHome onLogout={handleLogout} />
            </UserRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <UserRoute>
              <Cart onLogout={handleLogout} />
            </UserRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <UserRoute>
              <UserOrders onLogout={handleLogout} />
            </UserRoute>
          </PrivateRoute>
        }
      />

      {/* FAVOURITES */}
      <Route
        path="/favourites"
        element={
          <PrivateRoute>
            <UserRoute>
              <Favourites onLogout={handleLogout} />
            </UserRoute>
          </PrivateRoute>
        }
      />

      {/* VENDOR */}
      <Route
        path="/vendor"
        element={
          <PrivateRoute>
            <VendorRoute>
              <VendorHome onLogout={handleLogout} />
            </VendorRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/vendor/orders"
        element={
          <PrivateRoute>
            <VendorRoute>
              <VendorOrders onLogout={handleLogout} />
            </VendorRoute>
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </Router>
  );
}
