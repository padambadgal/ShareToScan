import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import QRCodeCard from '../components/QRCodeCard';
import { uploadFile } from '../services/fileApi';

const UploadPage = () => {
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setLoading(true);
    setError('');
    try {
      const res = await uploadFile(file);
      if (res.success) {
        setUploadResult(res.data);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Upload a File</h1>
      <UploadForm onUpload={handleUpload} loading={loading} />
      {error && <p className="text-red-600 bg-white p-4 rounded-xl shadow mb-4">{error}</p>}
      {uploadResult && (
        <>
          <QRCodeCard
            qrCode={uploadResult.qrCode}
            downloadUrl={uploadResult.downloadUrl}
            fileId={uploadResult.fileId}
          />
          <button
            onClick={() => navigate(`/file/${uploadResult.fileId}`)}
            className="mt-4 bg-purple-600 mx-2 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            View File Details
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white mx-2 px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default UploadPage;