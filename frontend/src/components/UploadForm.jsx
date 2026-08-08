import React, { useState } from 'react';

const UploadForm = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onUpload(file);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload & Generate QR'}
      </button>
    </form>
  );
};

export default UploadForm;