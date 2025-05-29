// client/src/pages/Home.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import {
  SiAdobe,
  SiBehance,
  SiFigma,
  SiLinkedin,
  SiMedium,
  SiFacebook,
  SiPinterest,
  SiGithub,
} from "react-icons/si";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const doSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#21004b,#3a0c6e)] text-white pt-16">
      <NavBar />

      <div
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="inline-flex bg-white/10 rounded-full px-4 py-1 mb-4">
          <span className="uppercase bg-white text-gray-900 px-2 py-1 rounded-full mr-2 text-xs">
            Fastest way
          </span>
          <span>Find Your Perfect Hire</span>
          <span className="font-semibold mx-1">Celanese</span>
          <span>→</span>
        </div>

        <h1 className="font-bold leading-tight text-5xl md:text-6xl lg:text-7xl hover:scale-105 transition-transform">
          Discover the Right
          <br />
          Talent in Time
        </h1>
        <p className="mt-4 text-gray-300">
          Best candidates using our intelligent hiring platform
        </p>

        <form
          onSubmit={doSearch}
          className="mt-8 flex w-full max-w-lg rounded-full overflow-hidden shadow-lg"
        >
          <input
            className="flex-grow px-4 py-2 text-gray-900 rounded-l-full focus:outline-none"
            placeholder="🔍 Search jobs..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 px-6 text-white font-medium rounded-r-full transition"
          >
            Search
          </button>
        </form>

        <div className="mt-8 flex gap-4">
          {/* No one logged in */}
          {!user && (
            <button
              onClick={() => navigate("/signup")}
              className="bg-purple-400 hover:bg-purple-500 px-6 py-3 rounded-full transition transform hover:scale-105"
            >
              Get started
            </button>
          )}

          {/* Normal user logged in */}
          {user && !user.isAdmin && (
            <button
              onClick={() => navigate("/jobs")}
              className="bg-purple-400 hover:bg-purple-500 px-6 py-3 rounded-full transition transform hover:scale-105"
            >
              Apply now
            </button>
          )}

          {/* Admin logged in */}
          {user?.isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="border border-white hover:bg-white/10 px-6 py-3 rounded-full transition transform hover:scale-105"
            >
              Post a Job Today
            </button>
          )}
        </div>

        <p className="mt-12 text-gray-400">
          Built-in marketing tools · social media integration
        </p>
        <div className="mt-4 flex gap-4 text-gray-300">
          {[
            SiAdobe,
            SiBehance,
            SiFigma,
            SiLinkedin,
            SiMedium,
            SiFacebook,
            SiPinterest,
            SiGithub,
          ].map((Icon, i) => (
            <Icon key={i} className="h-6 w-6 hover:text-white transition" />
          ))}
        </div>
      </div>
    </div>
  );
}
