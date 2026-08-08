import QRCode from 'qrcode';

// ---------- Storage key ----------
const STORAGE_KEY = 'qrshare_files';

// ---------- Load from localStorage ----------
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

// ---------- In-memory store (initialized from storage) ----------
let filesStore = loadFromStorage();
let nextId = filesStore.length > 0 
  ? Math.max(...filesStore.map(f => parseInt(f._id, 10))) + 1 
  : 1;

// ---------- Helpers ----------
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateQR = async (text) => {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
  });
};

// ---------- API-like functions ----------

export const uploadFile = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileId = generateId();
      const downloadUrl = `/file/${fileId}`; // fake URL, just for display

      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result; // base64 data URL

        const qrCode = await generateQR(downloadUrl);

        const newFile = {
          _id: String(nextId++),
          fileId,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          fileData,
          downloadUrl,
          qrCode,
          createdAt: new Date().toISOString(),
        };

        filesStore.push(newFile);
        saveToStorage(filesStore); // ✅ persist after upload

        resolve({
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
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllFiles = async () => {
  // Always return current store (which is already synced)
  return {
    success: true,
    data: filesStore,
  };
};

export const getFileDetails = async (fileId) => {
  const file = filesStore.find((f) => f.fileId === fileId);
  if (!file) {
    return { success: false, message: 'File not found' };
  }
  return {
    success: true,
    data: {
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      uploadedAt: file.createdAt,
      downloadUrl: file.downloadUrl,
      qrCode: file.qrCode,
    },
  };
};

export const downloadFile = async (fileId) => {
  const file = filesStore.find((f) => f.fileId === fileId);
  if (!file) throw new Error('File not found');
  const response = await fetch(file.fileData);
  const blob = await response.blob();
  return blob;
};

export const deleteFile = async (fileId) => {
  const index = filesStore.findIndex((f) => f.fileId === fileId);
  if (index === -1) {
    return { success: false, message: 'File not found' };
  }
  filesStore.splice(index, 1);
  saveToStorage(filesStore); // ✅ persist after deletion
  return { success: true, message: 'File deleted successfully' };
};