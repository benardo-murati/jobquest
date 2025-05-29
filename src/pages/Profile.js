// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(); // "success" or "error"

  useEffect(() => {
    if (!photoFile) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photoFile);
  }, [photoFile]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) setPhotoFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      let photoURL = user.photoURL || "";

      if (photoFile) {
        const b64 = await toBase64(photoFile);
        const form = new FormData();
        form.append("image", b64);
        form.append("name", `${user.uid}-${photoFile.name}`);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
          { method: "POST", body: form }
        );
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error?.message || "ImgBB upload failed");
        }
        photoURL = json.data.url;
      }

      await updateUserProfile({ displayName, photoURL });
      setMsgType("success");
      setMsg("Profile updated successfully!");
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      setMsgType("error");
      setMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName || "User"
  )}&background=4F46E5&color=fff&size=128`;

  const avatarSrc = photoPreview || user?.photoURL || defaultAvatarUrl;

  return (
    <>
      <NavBar />

      <main className="pt-24 min-h-screen bg-[linear-gradient(135deg,#21004b,#3a0c6e)] px-4 pb-16 flex items-start md:items-center justify-center">
        <div className="max-w-md w-full transform transition-transform duration-500 ease-out hover:-translate-y-6 hover:shadow-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Your Profile
            </h1>

            {msg && (
              <div
                className={`text-sm text-center mb-4 ${
                  msgType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {msg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 mb-4 transform transition-transform duration-500 ease-out hover:scale-110">
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={saving}
                  />
                </label>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={saving}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-2 border bg-gray-100 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-2 rounded-full text-white font-medium transition ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>

            {/* Logout */}
            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
