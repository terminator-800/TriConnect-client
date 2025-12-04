import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function RejectApplicant({ selectedUser, onClose, role }) {
  if (!selectedUser) return null;
  console.log(role, "ROLE REJECT");
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const applicantName = selectedUser?.authorized_person || selectedUser?.name || 'Applicant';
  
    
  const handleReject = async () => {
    setIsLoading(true);
    setError(null);

    const payload = {
      applicant_id: selectedUser.sender_id,
    };
    console.log(role, "ROLE REJECT");  
    console.log(selectedUser, "REJECT MODAL");  
    console.log(payload, "REJECT APPLICANT PAYLOAD");
    
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${role}/job-application/reject-applicant`,
        payload,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setShowConfirmation(true);
      
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to reject applicant. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Rejection cancelled');
    if (onClose) onClose();
  };

  const handleClose = () => {
    setShowConfirmation(false);
    if (onClose) onClose();
  };



  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 ml-55">
      {!showConfirmation ? (
        <div className="backdrop-blur-2xl shadow-lg p-12 max-w-5xl w-full">
          <h2 className="text-2xl font-normal text-[#2C3E50] text-center mb-8">
            Are you sure you want to <span className="text-red-500 font-normal">decline</span> {applicantName} for the <span className='font-semibold'>{selectedUser?.job_title}</span> position? 
          </h2>
          
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Yes'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-10 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-2xl shadow-lg p-12 max-w-5xl w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
          
          <h2 className="text-3xl font-normal text-red-500 text-center mb-6">
            Application Rejected Successfully!
          </h2>
          
          <p className="text-[#6B7280] text-center text-lg leading-relaxed">
            {applicantName} has been rejected for the <span className="font-semibold">{selectedUser?.job_title}</span> position.
          </p>
          
          <p className="text-[#6B7280] text-center text-lg leading-relaxed mt-2">
            This will move the applicant to your <span className='font-semibold'>Rejected Applicants</span> list.
          </p>
        </div>
      )}
    </div>
  );
}

RejectApplicant.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};