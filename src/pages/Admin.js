// src/pages/AdminDashboard.jsx

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const { user } = useAuth();

  // --- form state ---
  const [job, setJob] = useState({
    title: "",
    description: "",
    salary: "",
    jobType: "full-time",
    keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // redirect non-admins
  if (!user?.isAdmin) {
    return (
      <>
        <NavBar />
        <main className="pt-24 flex justify-center items-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white p-8 rounded-lg shadow text-red-600 font-semibold text-lg">
            Access denied.
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  // submit new job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const kwArray = job.keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      await addDoc(collection(db, "jobs"), {
        title: job.title,
        description: job.description,
        salary: Number(job.salary),
        jobType: job.jobType,
        keywords: kwArray,
        postedBy: user.uid,
        createdAt: serverTimestamp(),
        applicants: [],
      });

      setMessage({ text: "✅ Job posted successfully!", type: "success" });
      setJob({
        title: "",
        description: "",
        salary: "",
        jobType: "full-time",
        keywords: "",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        text: `❌ Failed to post job: ${err.message}`,
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <NavBar />

      <main
        className="pt-24 bg-gradient-to-tr from-purple-900 to-indigo-900 
                   min-h-screen px-4 pb-16 flex items-start md:items-center 
                   justify-center"
      >
        <div
          className="w-full max-w-md transform transition-transform 
                     duration-500 ease-out hover:-translate-y-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
              Admin Dashboard – Post New Job
            </h1>

            {message.text && (
              <p
                className={`text-center mb-4 font-medium ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Job Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={job.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={job.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg resize-y 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Salary */}
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="e.g. 50000"
                  value={job.salary}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Job Type */}
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keywords{" "}
                  <span className="text-xs text-gray-400">
                    (comma-separated)
                  </span>
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  placeholder="e.g. react, ui, frontend"
                  value={job.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-full text-white font-medium transition ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Posting…" : "Post Job"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
