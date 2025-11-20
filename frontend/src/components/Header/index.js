import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        <div
          onClick={() => handleNavigate("/home")}
          className="text-2xl font-bold tracking-wide cursor-pointer hover:text-gray-100"
        >
          Food Express
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavigate("/home")}
            className={`text-lg font-medium transition-all duration-200 ${
              location.pathname === "/home"
                ? "text-orange-900 bg-white px-4 py-2 rounded-full"
                : "hover:text-orange-200"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavigate("/cart")}
            className={`text-lg font-medium transition-all duration-200 ${
              location.pathname === "/cart"
                ? "text-orange-900 bg-white px-4 py-2 rounded-full"
                : "hover:text-orange-200"
            }`}
          >
            Cart
          </button>

          <button
            onClick={() => handleNavigate("/orders")}
            className={`text-lg font-medium transition-all duration-200 ${
              location.pathname === "/orders"
                ? "text-orange-900 bg-white px-4 py-2 rounded-full"
                : "hover:text-orange-200"
            }`}
          >
            My Orders
          </button>

          {/* ⭐ ADDED FAVOURITES BUTTON */}
          <button
            onClick={() => handleNavigate("/favourites")}
            className={`text-lg font-medium transition-all duration-200 ${
              location.pathname === "/favourites"
                ? "text-orange-900 bg-white px-4 py-2 rounded-full"
                : "hover:text-orange-200"
            }`}
          >
            Favourites ❤️
          </button>

          <button
            onClick={handleLogout}
            className="text-lg font-medium bg-white text-orange-600 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Icon */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-orange-400 flex flex-col items-center space-y-4 py-4 shadow-lg transition-all duration-300">
          <button
            onClick={() => handleNavigate("/home")}
            className={`w-3/4 text-lg font-medium py-2 rounded-lg ${
              location.pathname === "/home"
                ? "bg-white text-orange-600"
                : "text-white hover:bg-orange-500"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavigate("/cart")}
            className={`w-3/4 text-lg font-medium py-2 rounded-lg ${
              location.pathname === "/cart"
                ? "bg-white text-orange-600"
                : "text-white hover:bg-orange-500"
            }`}
          >
            Cart
          </button>

          <button
            onClick={() => handleNavigate("/orders")}
            className={`w-3/4 text-lg font-medium py-2 rounded-lg ${
              location.pathname === "/orders"
                ? "bg-white text-orange-600"
                : "text-white hover:bg-orange-500"
            }`}
          >
            My Orders
          </button>

          {/* ⭐ FAVOURITES MOBILE BUTTON */}
          <button
            onClick={() => handleNavigate("/favourites")}
            className={`w-3/4 text-lg font-medium py-2 rounded-lg ${
              location.pathname === "/favourites"
                ? "bg-white text-orange-600"
                : "text-white hover:bg-orange-500"
            }`}
          >
            Favourites ❤️
          </button>

          <button
            onClick={handleLogout}
            className="w-3/4 text-lg font-medium py-2 rounded-lg bg-white text-orange-600 hover:bg-gray-100 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
