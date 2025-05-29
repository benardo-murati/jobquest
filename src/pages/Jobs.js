// src/pages/Jobs.jsx

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const term = params.get("search") || "";

  // Load all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "jobs"));
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // Filter by search term
  useEffect(() => {
    if (!term) return setFiltered(jobs);
    const t = term.toLowerCase();
    setFiltered(
      jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(t) ||
          j.description.toLowerCase().includes(t) ||
          (j.keywords || []).some((k) => k.includes(t))
      )
    );
  }, [jobs, term]);

  const onSearchChange = (e) => {
    const v = e.target.value;
    if (v) setParams({ search: v });
    else setParams({});
  };

  // Check current user's application record
  const myApp = (job) => user && job.applicants?.find((a) => a.id === user.uid);

  // Apply
  const apply = async (job) => {
    if (!user) return;
    const ref = doc(db, "jobs", job.id);
    const stamp = new Date().toISOString();
    await updateDoc(ref, {
      applicants: arrayUnion({
        id: user.uid,
        status: "pending",
        appliedAt: stamp,
      }),
    });
    // optimistic UI
    setJobs((js) =>
      js.map((j) =>
        j.id === job.id
          ? {
              ...j,
              applicants: [
                ...(j.applicants || []),
                { id: user.uid, status: "pending", appliedAt: stamp },
              ],
            }
          : j
      )
    );
  };

  // Withdraw
  const withdraw = async (job) => {
    if (!user) return;
    const record = myApp(job);
    if (!record) return;
    const ref = doc(db, "jobs", job.id);
    await updateDoc(ref, { applicants: arrayRemove(record) });
    setJobs((js) =>
      js.map((j) =>
        j.id === job.id
          ? {
              ...j,
              applicants: j.applicants.filter(
                (a) => a.id !== user.uid || a.status !== record.status
              ),
            }
          : j
      )
    );
  };

  // Admin: delete
  const deleteJob = async (jobId) => {
    if (!user?.isAdmin) return;
    await deleteDoc(doc(db, "jobs", jobId));
    setJobs((js) => js.filter((j) => j.id !== jobId));
  };

  return (
    <>
      <NavBar />

      {/* Gradient background like Home */}
      <main className="min-h-screen pt-24 pb-10 px-4 bg-[linear-gradient(135deg,#21004b,#3a0c6e)]">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Job Listings
          </h1>

          {/* Enhanced search bar */}
          <div className="relative mb-10">
            <input
              type="text"
              value={term}
              onChange={onSearchChange}
              placeholder="🔍 Search jobs..."
              className="w-full px-6 py-3 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 transition"
            />
            <button
              onClick={(e) => e.preventDefault()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              Search
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <p className="text-center text-gray-200">Loading jobs…</p>
          ) : filtered.length ? (
            <ul className="space-y-8">
              {filtered.map((job) => {
                const record = myApp(job);
                return (
                  <li
                    key={job.id}
                    className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-semibold text-indigo-800 mb-2">
                          {job.title}
                        </h2>
                        <p className="text-gray-700">{job.description}</p>
                      </div>
                      {user?.isAdmin && (
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/* User actions */}
                    {user && !user.isAdmin && (
                      <div className="mt-4 flex items-center gap-4">
                        {record ? (
                          <>
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                record.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </span>
                            {record.status === "pending" && (
                              <button
                                onClick={() => withdraw(job)}
                                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                              >
                                Withdraw
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => apply(job)}
                            className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center text-gray-200">
              <p>No jobs match “{term}”.</p>
              <p className="mt-2 text-sm">
                Try another search or clear filter.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
