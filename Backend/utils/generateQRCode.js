import qr from 'qrcode';

/**
 * Generates a QR code image as a Base64 data URL.
 * @param {string} url - The URL to encode in the QR code.
 * @returns {Promise<string>} - Base64 string of the QR code image.
 */
const generateQRCode = async (url) => {
  try {
    const qrDataUrl = await qr.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
    });
    return qrDataUrl; // e.g., "data:image/png;base64,iVBORw0K..."
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

export default generateQRCode;