import { useState } from 'react';
import PropTypes from 'prop-types';

export default function RejectApplicant({ selectedUser, onClose }) {
  if (!selectedUser) return null;

  const [showConfirmation, setShowConfirmation] = useState(false);

  const applicantName = selectedUser?.authorized_person || selectedUser?.name || 'Applicant';
  console.log(selectedUser?.job_title, "REJECT MODAL");
    
  const handleReject = () => {
    setShowConfirmation(true);
    // You can add API call here to reject the applicant
    console.log('Rejecting applicant:', selectedUser);
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
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReject}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-1 transition-colors cursor-pointer"
            >
              Yes
            </button>
            
            <button
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-10 py-1 transition-colors cursor-pointer"
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
            This will move the applicant to your <span className='font-semibold'>Rejected Applicants</span>list.
          </p>
        </div>
      )}
    </div>
  );
}

RejectApplicant.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};