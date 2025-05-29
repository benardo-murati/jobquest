// src/pages/Signup.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = email.includes("@") && email.includes(".");
  const isValidPassword = password.length >= 8 && /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!username.trim()) {
      setGeneralError("Username is required.");
      return;
    }
    if (!isValidEmail) {
      setEmailError("Please enter a valid email.");
      return;
    }
    if (!isValidPassword) {
      setPasswordError(
        "Password must be at least 8 characters and contain a number."
      );
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim(), password, username.trim());
      navigate("/profile");
    } catch (err) {
      console.error("Signup failed:", err);
      setGeneralError("Failed to create account: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <main className="pt-24 flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-900 to-indigo-900 px-4 py-10">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8
                     transform transition-transform duration-500 hover:-translate-y-2"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
            Create Account
          </h2>

          {generalError && (
            <p className="text-center text-red-600 mb-4 text-sm">
              {generalError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:shadow-md 
                           transition duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:shadow-md 
                           transition duration-200"
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:shadow-md 
                           transition duration-200"
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg transition
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading ? "Signing up…" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
