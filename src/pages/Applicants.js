// src/pages/Applicants.jsx

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Applicants() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // 1) load all users → map uid → username
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const m = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          m[d.id] = data.username || data.email;
        });
        setUsersMap(m);
      } catch (e) {
        console.error(e);
        setError("Failed to load users");
      }
    })();
  }, []);

  // 2) load all jobs & their applicants
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "jobs"));
        setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setError("Failed to load jobs");
      }
      setLoading(false);
    })();
  }, []);

  // Handler: Accept or Reject
  const updateStatus = async (jobId, applicant, newStatus) => {
    setActionLoading(true);
    try {
      const ref = doc(db, "jobs", jobId);
      // remove old
      await updateDoc(ref, {
        applicants: arrayRemove(applicant),
      });
      // add new
      await updateDoc(ref, {
        applicants: arrayUnion({
          ...applicant,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }),
      });
      // reflect locally
      setJobs((js) =>
        js.map((j) => {
          if (j.id !== jobId) return j;
          const filtered = (j.applicants || []).filter(
            (a) =>
              !(a.id === applicant.id && a.appliedAt === applicant.appliedAt)
          );
          return {
            ...j,
            applicants: [...filtered, { ...applicant, status: newStatus }],
          };
        })
      );
    } catch (e) {
      console.error(e);
      alert("Error updating: " + e.message);
    }
    setActionLoading(false);
  };

  // only admins may view
  if (!user?.isAdmin) {
    return (
      <>
        <NavBar />
        <main className="pt-24 flex justify-center items-center min-h-screen bg-gradient-to-tr from-purple-900 to-indigo-900 px-4">
          <div className="bg-white p-8 rounded-lg shadow text-red-600 font-semibold text-lg">
            Access denied.
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />

      <main className="pt-24 bg-gradient-to-tr from-purple-900 to-indigo-900 min-h-screen px-4 pb-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            All Applications
          </h1>

          {error && (
            <div className="text-red-400 bg-white/20 p-3 rounded">{error}</div>
          )}

          {loading ? (
            <p className="text-center text-white">Loading…</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-xl p-6 transform
                           transition-transform duration-300 ease-out
                           hover:-translate-y-2"
              >
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                  {job.title}
                </h2>

                {!job.applicants || job.applicants.length === 0 ? (
                  <p className="text-gray-500">No applicants yet.</p>
                ) : (
                  job.applicants.map((app) => (
                    <div
                      key={app.id + app.appliedAt}
                      className="flex items-center justify-between mb-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {usersMap[app.id] || app.id}
                        </p>
                        <p className="text-sm mt-1">
                          Status:{" "}
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                              app.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : app.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              updateStatus(job.id, app, "accepted")
                            }
                            className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              updateStatus(job.id, app, "rejected")
                            }
                            className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
