import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFileDetails, downloadFile } from '../services/fileApi';
import FileInfoCard from '../components/FileInfoCard';
import Loader from '../components/Loader';

const FileDetailsPage = () => {
  const { fileId } = useParams();
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getFileDetails(fileId);
        if (res.success) {
          setFileDetails(res.data);
        } else {
          setError(res.message || 'File not found');
        }
      } catch (err) {
        setError('Failed to load file details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [fileId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileDetails?.originalName || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container mx-auto px-4 py-8"><p className="text-red-600 bg-white p-4 rounded-xl shadow">{error}</p></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">File Details</h1>
      <FileInfoCard fileDetails={fileDetails} />
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mr-3"
      >
        {downloading ? 'Downloading...' : 'Download File'}
      </button>
      <button
        onClick={() => navigate('/')}
        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default FileDetailsPage;