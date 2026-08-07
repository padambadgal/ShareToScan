import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
      unique: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
      unique: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,   // base64 string
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('File', fileSchema);