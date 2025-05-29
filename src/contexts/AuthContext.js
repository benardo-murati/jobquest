// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "../services/firebase";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Sign up: create Auth user + Firestore profile
  async function signup(email, password, username) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = cred.user;
    await fbUpdateProfile(newUser, { displayName: username });
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      username,
      isAdmin: false,
      createdAt: serverTimestamp(),
    });
    return newUser;
  }

  // Email/password login with optional “remember me”
  function login(email, password, remember = false) {
    const persistence = remember
      ? browserLocalPersistence
      : browserSessionPersistence;
    return setPersistence(auth, persistence).then(() =>
      signInWithEmailAndPassword(auth, email, password)
    );
  }

  // Google SSO + ensure Firestore profile
  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;
    const userRef = doc(db, "users", gUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: gUser.uid,
        email: gUser.email,
        username: gUser.displayName || "",
        isAdmin: false,
        createdAt: serverTimestamp(),
      });
    }
    return gUser;
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserProfile(updates) {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is signed in."));
    }
    return fbUpdateProfile(auth.currentUser, updates);
  }

  // Listen for Auth changes, then subscribe to Firestore profile
  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (fbUser) {
        const ref = doc(db, "users", fbUser.uid);
        unsubscribeProfile = onSnapshot(
          ref,
          (snap) => {
            if (snap.exists()) {
              setUser({ ...fbUser, ...snap.data() });
            } else {
              setUser(fbUser);
            }
          },
          (err) => {
            console.error("Profile subscription error:", err);
            setUser(fbUser);
          }
        );
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}
