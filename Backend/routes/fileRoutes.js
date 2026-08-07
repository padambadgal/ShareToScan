import express from 'express';
import {
  uploadFile,
  getAllFiles,
  getFileDetails,
  downloadFile,
  deleteFile,
} from '../controllers/fileController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getAllFiles);
router.get('/:fileId', getFileDetails);
router.get('/download/:fileId', downloadFile);
router.delete('/:fileId', deleteFile);

export default router;