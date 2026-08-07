import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import File from '../models/File.js';
import generateQRCode from '../utils/generateQRCode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Helper to build download URL
const buildDownloadUrl = (fileId) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/api/files/download/${fileId}`;
};

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Public
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const downloadUrl = buildDownloadUrl(fileId);
    const qrCode = await generateQRCode(downloadUrl);

    const newFile = new File({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      fileId,
      downloadUrl,
      qrCode,
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      data: {
        fileId: newFile.fileId,
        originalName: newFile.originalName,
        fileSize: newFile.fileSize,
        mimeType: newFile.mimeType,
        downloadUrl: newFile.downloadUrl,
        qrCode: newFile.qrCode,
        uploadedAt: newFile.createdAt,
      },
    });
  } catch (error) {
    // Remove uploaded file if any
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Get all files
// @route   GET /api/files
// @access  Public
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: files });
  } catch (error) {
    console.error('Get all files error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get file details by fileId
// @route   GET /api/files/:fileId
// @access  Public
export const getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({ fileId });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        uploadedAt: file.createdAt,
        downloadUrl: file.downloadUrl,
        qrCode: file.qrCode,
      },
    });
  } catch (error) {
    console.error('Get file details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Download file by fileId
// @route   GET /api/files/download/:fileId
// @access  Public
export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({ fileId });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const filePath = path.join(uploadsDir, file.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Download failed' });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete file by fileId
// @route   DELETE /api/files/:fileId
// @access  Public
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({ fileId });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Remove file from filesystem
    const filePath = path.join(uploadsDir, file.storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    await file.deleteOne();

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};