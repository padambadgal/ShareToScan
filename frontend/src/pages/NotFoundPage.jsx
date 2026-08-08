import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8">The file or page you are looking for does not exist.</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition inline-block">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;