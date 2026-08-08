import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/files",
  headers: {
    "Content-Type": "application/json",
  },
});

let filesCache = null;

// Upload File
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  filesCache = null;
  return data;
};

// Get All Files
export const getAllFiles = async () => {
  if (filesCache) {
    return {
      success: true,
      data: filesCache,
    };
  }

  const { data } = await api.get("/");

  filesCache = data.data || [];

  return data;
};

// Get Single File Details
export const getFileDetails = async (fileId) => {
  const { data } = await api.get(`/${fileId}`);
  return data;
};

// Download File
export const downloadFile = async (fileId) => {
  const response = await api.get(`/download/${fileId}`, {
    responseType: "blob",
  });

  return response.data;
};

// Delete File
export const deleteFile = async (fileId) => {
  const { data } = await api.delete(`/${fileId}`);

  filesCache = null;

  return data;
};