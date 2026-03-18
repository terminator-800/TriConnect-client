import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import icons from '../assets/svg/Icons';
import socket from '../../utils/socket';

const MessageAgency = ({ receiver, role, onClose }) => {
  const queryClient = useQueryClient();

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const receiver_id = Number(receiver?.agency_id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ receiver_id, message, file }) => {
      const formData = new FormData();
      formData.append('agency_profile_id', receiver.user_id);
      formData.append('receiver_id', receiver_id);
      formData.append('message', message);

      if (file) formData.append('files', file);

      const url = `${import.meta.env.VITE_API_URL}/${role}/message-agency`;
      const { data } = await axios.post(url, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return data;
    },

    onSuccess: (data, vars) => {
      setSuccess(true);
      setMessage('');
      setFile(null);

      socket.emit('sendMessage', {
        receiver_id,
        message_text: vars.message,
        file_url: data.file_url,
      });

      queryClient.invalidateQueries({
        queryKey: ['uncontacted-agencies', role],
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500000000);
    },

    onError: () => {
      alert('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) return;

    mutation.mutate({
      receiver_id,
      message,
      file,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="max-w-6xl shadow-2xl max-h-[90vh] flex flex-col bg-[#D9D9D9] w-full  py-5 px-10 xl:ml-60 border border-gray-500">
      <div className="flex justify-between items-center pb-3 mb-5">
        <div>
          <strong className="md:text-2xl text-sm font-bold truncate block">Upload Documents</strong>
          <span className="text-[#6B7280] md:text-xl text-sm">Attach your resume</span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close application form"
          className="ml-auto text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 max-[769px]:w-7 max-[769px]:h-7 flex items-center justify-center font-bold text-lg max-[769px]:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>

      <div className="flex md:flex-row flex-col justify-between gap-5">
        {/* RESUME */}
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="file" className="text-gray-900 mb-3 flex items-center gap-2">
            <img src={icons.resume} alt="Resume icon" /> Resume / CV{' '}
            <span className="text-red-600">*</span>
          </label>

          <div className="mt-2 flex flex-col">
            <label
              htmlFor="resume"
              className="border-2 border-dashed border-[#6B7280] bg-blue-50 rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center hover:bg-blue-100 transition"
            >
              <span className="text-3xl md:block hidden">
                <img src={icons.drag_drop} alt="" />
              </span>
              <span className="text-sm font-semibold text-gray-700 md:block hidden">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">PDF (Max 10MB)</span>
            </label>

            <input
              type="file"
              id="resume"
              name="file"
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isSubmitting}
            />

            {file && (
              <p className="text-sm text-gray-700 mt-2">
                Selected: <strong>{file.name}</strong>
              </p>
            )}
          </div>
        </div>

        {/* COVER LETTER */}
        <div className="w-full">
          <label htmlFor="cover_letter" className="text-gray-900 mb-3 flex items-center gap-2">
            <img src={icons.cover_letter} alt="Cover letter icon" /> Cover Letter{' '}
            <span>(Optional)</span>
          </label>
          <textarea
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us why you're interested in this position and what makes you a great fit... "
            className="w-full rounded p-3 border border-[#6B7280] bg-blue-50 resize-none outline-none focus:border-blue-500 disabled:bg-gray-200"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div
        className="flex justify-center gap-3 mt-4
          max-[769px]:flex-col 
          max-[769px]:items-stretch
          max-[426px]:flex-col 
          max-[426px]:items-stretch
          "
      >
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim()}
          className={`px-10 py-1 text-white ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-900 cursor-pointer'
          }`}
        >
          {isSubmitting ? 'Sending…' : 'Continue'}
        </button>
      </div>

      {success && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center p-4 z-50 xl:ml-60">
          <div className="backdrop-blur-2xl shadow-lg max-w-5xl w-full relative">
            <button
              onClick={onClose}
              aria-label="Close success modal"
              className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="py-24 px-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Application Submitted!</h1>

              <p className="text-lg text-gray-500">
                Your message and documents have been successfully sent.
                <br />
                Please wait for the agency to respond.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageAgency;
