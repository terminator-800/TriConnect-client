import { useState } from 'react';

// Simple date formatter
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (err) {
    console.error('Invalid date format:', dateString);
    return dateString;
  }
};

export const HireApplicantCard = ({ msg, isSender }) => {
  const {
    job_title,
    employer_name,
    full_name,
    hire_message,
    start_date,
    end_date,
  } = msg;

  const [status, setStatus] = useState('pending'); // pending, accepted, declined

  const formattedStartDate = formatDate(start_date);
  const formattedEndDate = formatDate(end_date);

  // Check if any required field is empty
  const hasEmptyFields =
    !job_title ||
    !employer_name ||
    !full_name ||
    !hire_message ||
    !end_date ||
    !start_date;

  if (hasEmptyFields) {
    return (
      <div className="w-full max-w-lg px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
        <p className="text-red-700 text-sm font-semibold">⚠️ Incomplete Hire Offer</p>
        <p className="text-red-600 text-xs mt-1">Some required fields are missing.</p>
      </div>
    );
  }

  const handleAccept = () => {
    setStatus('accepted');
    // Add your accept logic here
    console.log('Job offer accepted');
  };

  const handleDecline = () => {
    setStatus('declined');
    // Add your decline logic here
    console.log('Job offer declined');
  };

  return (
    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
      {/* Content */}
      <div className="px-8 py-8 space-y-6">
        {/* Greeting */}
        <p className="text-gray-800 text-base leading-relaxed">
          Hi [{full_name}],
        </p>

        {/* Job Selection Message */}
        <p className="text-gray-800 text-base leading-relaxed">
          You have been selected for the position of [{job_title}] at [{employer_name}].
        </p>

        {/* Important Notice */}
        <p className="text-gray-800 text-base leading-relaxed">
          By <span className="font-bold">accepting this offer</span>, your account will be{' '}
          <span className="font-bold">temporarily disabled</span> from [{formattedStartDate}] until [{formattedEndDate}]. 
          This means you will <span className="font-bold">not be able to apply for other jobs or access job-seeking features</span> during your employment.
        </p>

        {/* Reactivation Notice */}
        <p className="text-gray-800 text-base leading-relaxed">
          Your account will be <span className="font-bold">automatically reactivated</span> once your employment/contract period ends.
        </p>

        {/* Question */}
        <p className="text-gray-800 text-base leading-relaxed">
          Do you accept this job offer?
        </p>

        {/* Action Buttons */}
        {status === 'pending' && !isSender && (
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={handleAccept}
              className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-md transition-colors duration-200"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="px-12 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-base rounded-md transition-colors duration-200"
            >
              Decline
            </button>
          </div>
        )}

        {/* Status Messages */}
        {status === 'accepted' && (
          <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 text-center">
            <p className="text-green-700 font-semibold">✓ You have accepted this job offer</p>
          </div>
        )}

        {status === 'declined' && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-center">
            <p className="text-red-700 font-semibold">✗ You have declined this job offer</p>
          </div>
        )}

        {/* Sender View */}
        {isSender && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 text-center">
            <p className="text-blue-700 text-sm">Job offer sent. Waiting for response...</p>
          </div>
        )}
      </div>
    </div>
  );
};