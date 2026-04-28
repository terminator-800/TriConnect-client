import { useEffect, useState } from 'react';
import { useSubmitFeedback } from '../../hooks/useSubmitFeedback';

const Feedback = ({ onClose, role }) => {
  const MAX_CHARS = 500;
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState('');
  const { mutate: submitFeedback, isLoading } = useSubmitFeedback(role, onClose);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = () => {
    if (!sentiment) {
      alert('Please select Positive or Negative feedback.');
      return;
    }

    if (!message.trim()) {
      alert('Please enter your feedback.');
      return;
    }

    const payloadMessage = `[${sentiment.toUpperCase()}] ${message.trim()}`;
    submitFeedback({ message: payloadMessage });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-none px-4">
      <div className="relative w-[550px] max-w-full bg-white border border-gray-300 shadow-2xl">
        <div className="bg-[#2563EB] px-6 py-5">
          <h2 className="text-2xl font-bold text-white">Share Your Feedback</h2>
          <p className="text-white/90 text-base mt-1">Help us improve TriConnect</p>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-[#111827] text-base font-semibold mb-3">How would you rate your experience?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <button
              type="button"
              onClick={() => setSentiment('positive')}
              className={`border h-12 text-base cursor-pointer transition ${
                sentiment === 'positive'
                  ? 'bg-[#DBEAFE] border-[#2563EB] text-[#2563EB] font-semibold'
                  : 'bg-[#E5E7EB] border-[#9CA3AF] text-[#111827]'
              }`}
            >
              {`👍 Positive`}
            </button>
            <button
              type="button"
              onClick={() => setSentiment('negative')}
              className={`border h-12 text-base cursor-pointer transition ${
                sentiment === 'negative'
                  ? 'bg-[#FEE2E2] border-[#EF4444] text-[#B91C1C] font-semibold'
                  : 'bg-[#E5E7EB] border-[#9CA3AF] text-[#111827]'
              }`}
            >
              {`👎 Negative`}
            </button>
          </div>

          <h4 className="text-[#111827] text-base font-semibold mb-2">Tell us more (optional)</h4>
          <textarea
            rows="4"
            maxLength={MAX_CHARS}
            className="w-full border border-[#9CA3AF] px-3 py-3 mb-2 h-[170px] text-base outline-none resize-none bg-[#E5E7EB] placeholder:text-[#6B7280]"
            placeholder="Share your thoughts, suggestions, or describe the issue your experiencing...."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-[#4B5563] text-sm mb-5">{`${message.length} / ${MAX_CHARS} characters`}</p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-2 min-w-[200px] text-base cursor-pointer ${
                isLoading ? 'bg-gray-400 text-gray-200' : 'bg-[#2563EB] text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 min-w-[200px] text-base cursor-pointer bg-[#334155] text-white hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
