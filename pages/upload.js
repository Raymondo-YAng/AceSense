import React from 'react';
import { createRoot } from 'react-dom/client';
import BottomNavigation from '../components/BottomNavigation.js';
import Button from '../components/Button.js';
import { X } from 'lucide-react';

function UploadView() {
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use the actual backend URL
      const response = await fetch('http://localhost:8000/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // Redirect to analysis page with the marked video URL
      // We pass the marked_url to the analysis page
      window.location.href = `./analysis.html?videoUrl=${encodeURIComponent(data.marked_url)}`;
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return React.createElement('div', { className: 'flex flex-col h-full' },
    React.createElement('input', {
      type: 'file',
      accept: 'video/*',
      style: { display: 'none' },
      ref: fileInputRef,
      onChange: handleFileChange
    }),
    React.createElement('div', { className: 'flex items-center bg-background p-4 pb-2 justify-between' },
      React.createElement('button', { onClick: () => window.history.back(), className: 'text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors' },
        React.createElement(X, { size: 24 })
      ),
      React.createElement('h2', { className: 'text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12' }, 'Upload')
    ),

    React.createElement('div', { className: 'flex-1 flex flex-col px-4 pt-5' },
      React.createElement('h3', { className: 'text-white tracking-light text-2xl font-bold leading-tight pb-2' }, 'Upload your swing'),
      React.createElement('p', { className: 'text-white text-base font-normal leading-normal pb-3 pt-1 opacity-90' }, 'Upload a video of your tennis swing to get started. Make sure the video is clear and shows your full swing.'),
      React.createElement('div', { className: 'flex flex-col gap-3 mt-4 items-stretch max-w-md mx-auto w-full' },
        React.createElement(Button, { 
          variant: 'primary', 
          onClick: handleUploadClick, 
          fullWidth: true,
          disabled: isUploading 
        }, isUploading ? 'Uploading and processing...' : 'Upload from library'),
        React.createElement(Button, { variant: 'secondary', onClick: () => fileInputRef.current.click(), fullWidth: true, disabled: isUploading }, 'Record a new video')
      )
    )
  );
}

function App() {
  return React.createElement(
    'div',
    { className: 'flex flex-col min-h-screen bg-background text-white max-w-md mx-auto shadow-2xl overflow-hidden relative' },
    React.createElement('div', { className: 'flex-1 overflow-y-auto no-scrollbar' }, React.createElement(UploadView)),
    React.createElement(BottomNavigation)
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(React.createElement(App));