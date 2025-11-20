import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Pick correct endpoint based on role and action
      const endpoint = isSignup
        ? role === "vendor"
          ? "http://localhost:5000/api/users/register"
          : "http://localhost:5000/api/validusers/register"
        : role === "vendor"
          ? "http://localhost:5000/api/users/login"
          : "http://localhost:5000/api/validusers/login";

      // ✅ Body depends on signup or login
      const body = isSignup
        ? { name: username, email, password, role }
        : { name: username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      alert(isSignup ? "Signup successful!" : "Login successful!");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("username", data.user.name);

      onLogin(data.user.role, data.user.name);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          🍴 FoodExpress {isSignup ? "Signup" : "Login"}
        </h1>

        {/* 🔹 Role Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              role === "user"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("vendor")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              role === "vendor"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Vendor
          </button>
        </div>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          {isSignup && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="mt-4 text-orange-600 hover:underline text-sm"
        >
          {isSignup
            ? "Already have an account? Login"
            : "New User? Create Account"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
