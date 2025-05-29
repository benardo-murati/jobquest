// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/Admin"; // or "./pages/AdminDashboard" if that’s your filename
import Applicants from "./pages/Applicants";
import AppliedJobs from "./pages/AppliedJobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AccessDenied from "./pages/AccessDenied";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Routes for any signed-in user */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applied" element={<AppliedJobs />} />

          {/* Admin-only pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/applicants" element={<Applicants />} />

          {/* Guest-only pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Catch-all */}
          <Route path="*" element={<AccessDenied />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
