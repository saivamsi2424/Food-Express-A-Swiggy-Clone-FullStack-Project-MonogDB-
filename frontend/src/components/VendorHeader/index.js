import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VendorHeader = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        <h1
          onClick={() => handleNavigate("/vendor")}
          className="text-2xl md:text-3xl font-bold tracking-wide cursor-pointer"
        >
          🍴 Foodies World
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => handleNavigate("/vendor/orders")}
            className={`font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
              location.pathname === "/vendor/orders"
                ? "bg-white text-orange-600"
                : "bg-transparent border border-white text-white hover:bg-white hover:text-orange-600"
            }`}
          >
            Orders
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
