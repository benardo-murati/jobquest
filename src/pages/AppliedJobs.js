// src/pages/AppliedJobs.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AppliedJobs() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  // Always run hooks first
  useEffect(() => {
    if (!user) return;

    (async () => {
      const snap = await getDocs(collection(db, "jobs"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(
        all.filter(
          (job) =>
            Array.isArray(job.applicants) &&
            job.applicants.some((a) => a.id === user.uid)
        )
      );
    })();
  }, [user]);

  // Withdraw a pending application
  const withdraw = async (jobId) => {
    const job = list.find((j) => j.id === jobId);
    if (!job) return;
    const app = job.applicants.find(
      (a) => a.id === user.uid && a.status === "pending"
    );
    if (!app) return;

    const ref = doc(db, "jobs", jobId);
    await updateDoc(ref, { applicants: arrayRemove(app) });

    // Optimistically update local state
    setList((prev) => prev.filter((j) => j.id !== jobId));
  };

  // Badge color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  // If not logged in, show guard
  if (!user) {
    return (
      <>
        <NavBar />
        <main className="pt-24 flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-900 to-indigo-900 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-700">
            You must be logged in to view your applications.
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="pt-24 bg-gradient-to-tr from-purple-900 to-indigo-900 min-h-screen px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-white mb-10">
          Your Applications
        </h1>
        <div className="max-w-2xl mx-auto space-y-6">
          {list.length > 0 ? (
            list.map((job) => {
              const app = job.applicants.find((a) => a.id === user.uid);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-xl p-6 transform
                             transition-transform duration-300 ease-out
                             hover:-translate-y-2"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 w-fit ${getStatusColor(
                      app.status
                    )}`}
                  >
                    Status:{" "}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  {app.status === "pending" && (
                    <button
                      onClick={() => withdraw(job.id)}
                      className="self-start px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-200">
              You haven’t applied to any jobs yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
