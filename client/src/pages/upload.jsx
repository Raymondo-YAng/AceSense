import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { X } from 'lucide-react';

export default function UploadView() {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

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
      navigate(`/analysis?videoUrl=${encodeURIComponent(data.marked_url)}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <input
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex items-center bg-background p-4 pb-2 justify-between">
        <button onClick={() => navigate(-1)} className="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Upload</h2>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-5">
        <h3 className="text-white tracking-light text-2xl font-bold leading-tight pb-2">Upload your swing</h3>
        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 opacity-90">Upload a video of your tennis swing to get started. Make sure the video is clear and shows your full swing.</p>
        <div className="flex flex-col gap-3 mt-4 items-stretch max-w-md mx-auto w-full">
          <Button 
            variant="primary" 
            onClick={handleUploadClick} 
            fullWidth={true}
            disabled={isUploading} 
          >{isUploading ? 'Uploading and processing...' : 'Upload from library'}</Button>
          <Button variant="secondary" onClick={() => fileInputRef.current.click()} fullWidth={true} disabled={isUploading}>Record a new video</Button>
        </div>
      </div>
    </div>
  );
}