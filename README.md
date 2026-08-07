# QRShare Backend

Backend API for **QRShare**, a QR-code-based file sharing application.

## 🚀 Features

* Upload files
* Generate unique file IDs
* Generate QR codes
* View file details
* Download files
* Delete files
* MongoDB storage
* Offline/local-network support

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* QRCode
* UUID
* CORS
* dotenv

## 📁 Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── uploads/
├── .env
└── server.js
```

## 📦 Installation

```bash
npm install
```

## 🔐 Environment Variables

Create `.env`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/qrshare
FRONTEND_URL=http://localhost:5173
```

## ▶️ Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## 🔗 API Routes

| Method | Route                         | Purpose                   |
| ------ | ----------------------------- | ------------------------- |
| POST   | `/api/files/upload`           | Upload file & generate QR |
| GET    | `/api/files`                  | Get all files             |
| GET    | `/api/files/:fileId`          | Get file details          |
| GET    | `/api/files/download/:fileId` | Download file             |
| DELETE | `/api/files/:fileId`          | Delete file               |

## 🔄 Workflow

```text
Upload File
     ↓
Multer
     ↓
Save File + MongoDB
     ↓
Generate QR Code
     ↓
Share QR
     ↓
Scan QR
     ↓
File Details
     ↓
Download File
```

## 📡 Offline Mode

QRShare can work without internet when both devices are connected to the same **Wi-Fi or mobile hotspot**.

```text
Laptop (Express Server)
        ↓
   Local Network
        ↓
    Phone Scan QR
        ↓
    Download File
```

## 👨‍💻 Project

**QRShare — QR Code Based File Sharing System**
