// src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      return setError("Please enter both email and password.");
    }
    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      navigate("/");
    } catch (err) {
      console.error("Email login error:", err);
      setError(err.message || "Failed to log in.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google sign-in failed.");
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
            Log in to your account
          </h2>

          {error && (
            <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:shadow-md 
                           transition duration-200"
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 
                           focus:ring-2 focus:ring-indigo-500 focus:shadow-md 
                           transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {!showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z 
                         M2.458 12C3.732 7.943 7.523 5 12 
                         5c4.478 0 8.268 2.943 9.542 7-1.274 
                         4.057-5.064 7-9.542 7-4.477 
                         0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 
                         19c-5.523 0-10-4.477-10-10a9.956 
                         9.956 0 012.011-5.825M6.43 
                         6.43A9.956 9.956 0 0112 5c5.523 
                         0 10 4.477 10 10 0 2.121-.654 
                         4.084-1.754 5.725"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={loading}
                  onChange={() => setRememberMe((v) => !v)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mb-4 text-white font-semibold rounded-lg transition 
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 inline-block"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Google Sign‐in */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg 
                       bg-white hover:bg-gray-50 transition font-medium text-gray-700 shadow-sm"
          >
            {/* Google SVG omitted for brevity */}
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
