import { useRef, useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import icons from '../../../../assets/svg/Icons';
import axios from 'axios';

const ResumeSection = ({ onDownload, onResubmit, uploadedUrl }) => {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploaded, setUploaded] = useState(!!uploadedUrl); // mark uploaded if already has a resume
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Trigger file selection
  const handleResubmitClick = () => {
    fileInputRef.current.click();
  };

  // When user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type;
    if (type.includes('pdf')) setFileType('pdf');
    else if (type.includes('image')) setFileType('image');
    else {
      alert('Only PDF or image files are allowed.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload file
  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${ROLE.JOBSEEKER}/upload-resume`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert('Resume uploaded successfully!');
        setUploaded(true);
        setSelectedFile(null);
        setPreviewUrl(null);
        onResubmit?.(); // refresh parent
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  // Download file
  const handleDownloadClick = async () => {
    if (!uploadedUrl) return alert('No resume uploaded.');

    setDownloading(true);
    try {
      const response = await fetch(uploadedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedUrl.split('/').pop(); // filename from URL
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download resume.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-1/2 flex flex-col gap-4 text-[#6B7280]">
      {/* Header */}
      <div className="flex gap-2 items-center">
        <img src={icons.resume} className="h-6 object-contain" alt="resume icon" />
        <p>Resume</p>
      </div>

      {/* Preview Box */}
      <div className="border-2 rounded-md border-[#6B7280] border-dashed w-full h-100 bg-[#EAE6E6] flex items-center justify-center">
        {previewUrl || uploadedUrl ? (
          (fileType === 'pdf' || (!fileType && uploadedUrl?.endsWith('.pdf'))) ? (
            <iframe
              src={previewUrl || uploadedUrl}
              title="PDF Preview"
              className="w-full h-full"
            />
          ) : (
            <img
              src={previewUrl || uploadedUrl}
              alt="Resume Preview"
              className="max-h-full max-w-full object-contain"
            />
          )
        ) : (
          <span>Resume Preview</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-5">
        {/* Download Resume */}
        <button
          className={`px-10 py-5 bg-[#2563EB] text-white rounded-md cursor-pointer ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDownloadClick}
          disabled={downloading || uploading} // disable if downloading or uploading
        >
          {downloading ? 'Downloading...' : 'Download Resume'}
        </button>

        {/* Resubmit Resume - always visible */}
        <button
          className="px-10 py-5 border rounded-md border-[#CCCCCC] text-black cursor-pointer"
          onClick={handleResubmitClick}
          disabled={uploading || downloading}
        >
          Re-submit Resume
        </button>

        {/* Upload button - only when a new file is selected */}
        {selectedFile && (
          <button
            className={`px-10 py-5 bg-green-500 text-white rounded-md cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleUploadClick}
            disabled={uploading || downloading}
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ResumeSection;
