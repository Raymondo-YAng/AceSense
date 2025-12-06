import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    // In a real app, this would open file picker or camera.
    // For this UI demo, we navigate to the analysis results.
    navigate('/analysis');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center bg-background p-4 pb-2 justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Upload
        </h2>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-5">
        <h3 className="text-white tracking-light text-2xl font-bold leading-tight pb-2">
          Upload your swing
        </h3>
        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 opacity-90">
          Upload a video of your tennis swing to get started. Make sure the video is clear and shows your full swing.
        </p>
        
        <div className="flex flex-col gap-3 mt-4 items-stretch max-w-md mx-auto w-full">
          <Button variant="primary" onClick={handleAction} fullWidth>
            Upload from library
          </Button>
          <Button variant="secondary" onClick={handleAction} fullWidth>
            Record a new video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;