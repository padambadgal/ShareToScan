import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-indigo-300 transition">
          QRShare
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-300 transition">Home</Link>
          <Link to="/upload" className="hover:text-indigo-300 transition">Upload</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;