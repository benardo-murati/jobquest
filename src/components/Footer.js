import React from "react";

const Footer = () => (
  <footer className="bg-white text-gray-600 shadow-inner px-6 py-4 flex flex-wrap justify-between items-center text-sm md:flex-row flex-col text-center gap-2">
    <div className="font-bold text-blue-600 text-base">JobQuest</div>

    <div className="text-gray-500">
      © {new Date().getFullYear()} JobQuest. All rights reserved.
    </div>

    <a
      href="mailto:contact@jobquest.com"
      className="text-gray-500 hover:text-blue-600 hover:underline"
    >
      contact@jobquest.com
    </a>
  </footer>
);

export default Footer;
