import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../../../../../utils/socket';

const Apply = ({ employer, onClose }) => {
  const queryClient = useQueryClient();
  const [express_message, setExpressMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ job_post_id, receiver_id, express_message }) => {
      const formData = new FormData();
      formData.append('job_post_id', job_post_id);
      formData.append('receiver_id', receiver_id);
      formData.append('express_message', express_message);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/manpower-provider/applications`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(true);
      setExpressMessage('');

      socket.emit('sendMessage', {
        receiver_id: employer.user_id,
        express_message: express_message,
        file_url: data.file_url,
      });

      queryClient.invalidateQueries(['jobPostsByUser']);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    },
    onError: () => {
      alert('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!express_message.trim()) {
      alert('Please enter a message.');
      return;
    }

    mutation.mutate({
      job_post_id: employer.job_post_id,
      receiver_id: employer.user_id,
      express_message: express_message,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="backdrop-blur-2xl w-full max-w-5xl py-5 px-10 shadow-lg ml-55">
      <div className="flex justify-between items-center border-b pb-3 mb-5 border-gray-500">
        <div>
          <h2 className="text-xl font-bold">Express Interest</h2>
          <p className='text-[#6B7280] text-sm'>Send an initiation message to the employer</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg hover:bg-red-700 cursor-pointer"
          disabled={isSubmitting}
        >
         ✕
        </button>
      </div>

      <p className="text-gray-700 mb-1">Compose Message:</p>
      <textarea
        rows="6"
        value={express_message}
        onChange={(e) => setExpressMessage(e.target.value)}
        placeholder="Write a message or proposal to the employer..."
        className="w-full p-3 border border-gray-500 resize-none outline-none"
        disabled={isSubmitting}
      />

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !express_message.trim()}
          className={`px-10 py-1 text-white cursor-pointer ${
            isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-800'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {success && <p className="text-green-600 mt-3">Message sent successfully!</p>}
    </div>
  );
};

export default Apply;