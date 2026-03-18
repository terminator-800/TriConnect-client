import { useRef, forwardRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import icons from '../../../../assets/svg/Icons';

const BusinessFileUpload = forwardRef(
  ({ label, description, setFile, preview, setPreview, id, allowPreview = false }, ref) => {
    const fileInputRef = useRef();
    const videoRef = useRef();
    const canvasRef = useRef();

    const [showWebcam, setShowWebcam] = useState(false);
    const [stream, setStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        stopCamera();
        setShowWebcam(false);
      },
    }));

    const stopCamera = useCallback(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }, [stream]);

    useEffect(() => {
      return () => {
        if (stream) stream.getTracks().forEach((track) => track.stop());
      };
    }, [stream]);

    const startCamera = async () => {
      setCameraError(null);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setShowWebcam(true);
      } catch (err) {
        const messages = {
          NotAllowedError: 'Camera permission denied. Please allow camera access in your browser settings.',
          NotFoundError: 'No camera found on this device.',
          NotReadableError: 'Camera is being used by another app. Close it and try again.',
          SecurityError: 'Camera requires a secure connection (HTTPS).',
        };
        setCameraError(messages[err.name] ?? `${err.name}: ${err.message}`);
      }
    };

    const capturePhoto = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], `webcam-capture-${id}.jpg`, { type: 'image/jpeg' });
          setFile(file);
          if (allowPreview && setPreview) setPreview(canvas.toDataURL('image/jpeg'));
          stopCamera();
          setShowWebcam(false);
        },
        'image/jpeg',
        0.92
      );
    };

    const handleChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      // ── Only allow safe image types (no SVG) ───────────────────────────────
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const maxSizeInBytes = 5 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFile(selectedFile);
      if (allowPreview && setPreview) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      }
    };

    const handleCancel = () => {
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      stopCamera();
      setShowWebcam(false);
    };

    // ── Webcam view ───────────────────────────────────────────────────────────
    if (showWebcam) {
      return (
        <div className="border-2 border-blue-400 rounded px-6 py-5 flex flex-col items-center justify-center text-center mb-5 gap-3">
          <strong className="text-gray-700">{label}</strong>
          <p className="text-sm text-gray-500">Position yourself clearly, then click Capture.</p>

          <div className="relative rounded-lg overflow-hidden shadow-md bg-black w-full max-w-sm">
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && stream) el.srcObject = stream;
              }}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg"
            />
            <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              LIVE
            </span>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="bg-blue-900 text-white px-6 py-2 rounded-xl text-sm cursor-pointer hover:bg-blue-800 transition-colors"
            >
              📸 Capture
            </button>
            <button
              type="button"
              onClick={() => { stopCamera(); setShowWebcam(false); }}
              className="bg-gray-400 text-white px-6 py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // ── Preview state ─────────────────────────────────────────────────────────
    if (preview) {
      return (
        <div className="border-2 border-gray-400 rounded px-10 py-5 flex flex-col items-center justify-center text-center mb-5">
          <div className="flex flex-col items-center gap-2">
            {allowPreview && (
              <img
                src={preview}
                alt={`${label} Preview`}
                className="rounded shadow max-h-40 object-contain cursor-pointer mb-2"
                onClick={() => setPreview('modal')}
              />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm cursor-pointer bg-blue-900 px-5 py-2 rounded-xl text-white"
              >
                Reupload
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="text-sm cursor-pointer bg-green-700 px-5 py-2 rounded-xl text-white"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm cursor-pointer bg-red-500 px-5 py-2 rounded-xl text-white"
              >
                Cancel
              </button>
            </div>
          </div>
          <input ref={fileInputRef} onChange={handleChange} type="file" name={id} id={id} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" />
        </div>
      );
    }

    // ── Default (no file yet) ─────────────────────────────────────────────────
    return (
      <div className="border-2 border-gray-400 rounded px-10 py-5 flex flex-col items-center justify-center text-center mb-5 gap-3">
        <label htmlFor={id} className="cursor-pointer w-full">
          <strong className="text-gray-400">{label}</strong>
          <p className="pb-2">{description}</p>
        </label>

        {cameraError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2 w-full">
            {cameraError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <label htmlFor={id} className="cursor-pointer">
            <div className="border border-gray-400 rounded-xl flex items-center justify-center gap-5 p-2 hover:bg-gray-50 transition-colors">
              <img src={icons.attach_file} alt="" className="w-6" />
              <p className="text-gray-400 text-sm">Attach Files</p>
            </div>
          </label>

          <button
            type="button"
            onClick={startCamera}
            className="border border-gray-400 rounded-xl flex items-center justify-center gap-3 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-lg">📷</span>
            <p className="text-gray-400 text-sm">Use Webcam</p>
          </button>
        </div>

        <input ref={fileInputRef} onChange={handleChange} type="file" name={id} id={id} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" required />
      </div>
    );
  }
);

export default BusinessFileUpload;