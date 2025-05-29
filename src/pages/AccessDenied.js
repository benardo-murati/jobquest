import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const AccessDenied = () => {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-16">
        <div className="bg-white max-w-lg w-full text-center rounded-lg shadow-lg p-8">
          <h2 className="text-lg sm:text-xl text-gray-600 font-semibold">
            You do not have permission to view this page.
          </h2>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AccessDenied;
