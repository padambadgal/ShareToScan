import React, { useState } from 'react';

const QRCodeCard = ({ qrCode, downloadUrl, fileId }) => {
  const [copied, setCopied] = useState(false);

  // Copy download URL to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  // Generic share using Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Download my file',
          text: `Download this file using the following link:`,
          url: downloadUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback – copy link
      await handleCopy();
    }
  };

  // Direct platform links
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Download this file: ${downloadUrl}`
  )}`;
  const emailUrl = `mailto:?subject=Shared%20File&body=${encodeURIComponent(
    `Download this file: ${downloadUrl}`
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    downloadUrl
  )}&text=${encodeURIComponent('Download this file:')}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <h3 className="text-xl font-semibold mb-3">Your QR Code</h3>
      <img src={qrCode} alt="QR Code" className="mx-auto max-w-[200px] mb-4" />
      <p className="mb-1">
        <strong>Download URL:</strong>{' '}
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline break-all"
        >
          {downloadUrl}
        </a>
      </p>
      <p className="mb-2">
        <strong>File ID:</strong> <span className="font-mono text-sm">{fileId}</span>
      </p>

      {/* Share Options */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          {copied ? '✅ Copied!' : '📋 Copy Link'}
        </button>

        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          📤 Share
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          💬 WhatsApp
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          ✈️ Telegram
        </a>

        <a
          href={emailUrl}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
        >
          📧 Email
        </a>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Share the QR code image or use one of the buttons above to send the download link.
      </p>
    </div>
  );
};

export default QRCodeCard;