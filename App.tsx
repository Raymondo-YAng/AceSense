import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './views/Home';
import Profile from './views/Profile';
import Upload from './views/Upload';
import AnalysisResults from './views/AnalysisResults';
import BottomNavigation from './components/BottomNavigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/upload'; // Hide nav on upload screen if desired, though screenshot implies it might be there. Screenshot 4 has nav. Keeping it.

  return (
    <div className="flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<AnalysisResults />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;