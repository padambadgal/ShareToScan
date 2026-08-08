import React from 'react';

const FileInfoCard = ({ fileDetails }) => {
  const { originalName, fileSize, mimeType, uploadedAt } = fileDetails;

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-3">File Details</h3>
      <div className="space-y-2">
        <p><span className="font-medium">Name:</span> {originalName}</p>
        <p><span className="font-medium">Size:</span> {formatSize(fileSize)}</p>
        <p><span className="font-medium">Type:</span> {mimeType}</p>
        <p><span className="font-medium">Uploaded:</span> {new Date(uploadedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FileInfoCard;