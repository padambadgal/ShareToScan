import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFiles } from '../services/fileApi';
import Loader from '../components/Loader';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await getAllFiles();
        setFiles(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load files');
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleCopyLink = async (downloadUrl, fileId) => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopiedId(fileId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleShare = async (downloadUrl) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Download shared file',
          text: 'Download this file using the link below:',
          url: downloadUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      alert('Share not supported, copy the link manually.');
    }
  };

  const openQR = (file) => {
    setSelectedFile(file);
    document.body.style.overflow = 'hidden';
  };

  const closeQR = () => {
    setSelectedFile(null);
    document.body.style.overflow = 'auto';
  };

  // Helper to format date/time
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-600 bg-white p-4 rounded-xl shadow">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shared Files</h1>
      {files.length === 0 ? (
        <p className="text-gray-600">
          No files uploaded yet. <Link to="/upload" className="text-indigo-600 hover:underline">Upload one now!</Link>
        </p>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{file.originalName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>📦 {(file.fileSize / 1024).toFixed(2)} KB</span>
                  <span>•</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <span>🕒</span> {formatDate(file.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/file/${file.fileId}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-block text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={() => openQR(file)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition text-sm"
                >
                  📷 QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal with Sharing Options */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={closeQR}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeQR}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-1 text-center">{selectedFile.originalName}</h3>
            <p className="text-xs text-center text-gray-500 mb-3">
              🕒 Uploaded: {formatDate(selectedFile.createdAt)}
            </p>

            <img
              src={selectedFile.qrCode}
              alt="QR Code"
              className="mx-auto max-w-[200px] mb-4"
            />

            <p className="text-sm text-center text-gray-600 mb-1">
              <strong>Download URL:</strong>
            </p>
            <a
              href={selectedFile.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-indigo-600 hover:underline break-all text-sm mb-4"
            >
              {selectedFile.downloadUrl}
            </a>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleCopyLink(selectedFile.downloadUrl, selectedFile.fileId)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition text-sm flex items-center justify-center gap-1"
              >
                {copiedId === selectedFile.fileId ? '✅' : '📋'} Copy
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Download this file: ${selectedFile.downloadUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm flex items-center justify-center"
              >
                💬 WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(selectedFile.downloadUrl)}&text=${encodeURIComponent('Download this file:')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg transition text-sm flex items-center justify-center"
              >
                ✈️ Telegram
              </a>

              <a
                href={`mailto:?subject=Shared%20File&body=${encodeURIComponent(`Download this file: ${selectedFile.downloadUrl}`)}`}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition text-sm flex items-center justify-center"
              >
                📧 Email
              </a>

              <button
                onClick={() => handleShare(selectedFile.downloadUrl)}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm flex items-center justify-center"
              >
                📤 Share (Native)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;