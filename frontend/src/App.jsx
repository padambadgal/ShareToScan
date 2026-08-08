import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import FileDetailsPage from './pages/FileDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/file/:fileId" element={<FileDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;