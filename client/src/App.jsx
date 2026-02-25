import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './pages/home.jsx';
import UploadView from './pages/upload.jsx';
import AnalysisView from './pages/analysis.jsx';
import ProfileView from './pages/profile.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/upload" element={<UploadView />} />
            <Route path="/analysis" element={<AnalysisView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
}

export default App;