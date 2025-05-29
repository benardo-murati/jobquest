// src/components/NavBar.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAdmin = user?.isAdmin;

  const links = user
    ? [
        { to: "/", label: "Home" },
        { to: "/jobs", label: "Jobs" },
        { to: "/profile", label: "Profile" },
        !isAdmin && { to: "/applied", label: "Applied Jobs" },
        isAdmin && { to: "/admin", label: "Admin Dashboard" },
        isAdmin && { to: "/applicants", label: "Applicants" },
      ].filter(Boolean)
    : [];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-tr from-purple-800 to-indigo-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-l-full mr-2" />
          <span className="text-xl font-semibold text-white">JobQuest</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-white hover:opacity-80"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium border border-white rounded text-white hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:opacity-80">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium border border-white rounded text-white hover:bg-white/10"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-tr from-purple-800 to-indigo-900 p-4 space-y-2 md:hidden">
          {user ? (
            <>
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-white hover:opacity-80"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 border border-white rounded text-white hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white hover:opacity-80"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 border border-white rounded text-white hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
