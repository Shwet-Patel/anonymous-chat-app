import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-900 text-white py-6 text-center">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-lg font-semibold">
          Made with ❤️ for anonymous conversations
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Your privacy, your thoughts, your space.
        </p>

        <div className="flex gap-6 mt-4">
          <a href="#" className="hover:text-sky-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            Contact Us
          </a>
        </div>

        <div className="flex gap-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-instagram text-xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} True Feedback. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
