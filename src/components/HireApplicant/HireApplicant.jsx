import { useState } from 'react';
import PropTypes from 'prop-types';

export default function HireApplicant({ selectedUser, onClose }) {
          if (!selectedUser) return null;   // ⬅️ ADD THIS LINE

  const [showConfirmation, setShowConfirmation] = useState(false);

  const applicantName = selectedUser?.authorized_person || 'Applicant';
  const positionName = selectedUser?.position_name || 'Laundromat Attendant';
    console.log(selectedUser?.job_title, "HIRE MODAL");
    
  const handleAccept = () => {
    setShowConfirmation(true);
    // You can add API call here to accept the applicant
    console.log('Accepting applicant:', selectedUser);
  };

  const handleReject = () => {
    console.log('Applicant rejected');
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
          <h2 className="text-2xl font-normal text-gray-800 text-center mb-8">
            Are you sure you want to <span className="text-green-500 font-normal">accept</span> this applicant for the {selectedUser?.job_title} position?
          </h2>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-1 transition-colors cursor-pointer"
            >
              Yes
            </button>
            
            <button
              onClick={handleReject}
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-10 py-1 transition-colors cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 rounded-lg shadow-lg p-12 max-w-3xl w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          
          <h2 className="text-3xl font-normal text-green-500 text-center mb-6">
            Applicant Pending Confirmation
          </h2>
          
          <p className="text-gray-700 text-center text-lg leading-relaxed">
            {applicantName} has been selected for the <span className="font-semibold text-gray-800">{positionName}</span> position.
          </p>
          
          <p className="text-gray-700 text-center text-lg leading-relaxed mt-2">
            The applicant's response is <span className="font-semibold text-gray-800">awaited</span> to confirm acceptance. Once confirmed, they will be moved to your <span className="font-semibold text-gray-800">Hired Applicants list</span>.
          </p>
        </div>
      )}
    </div>
  );
}

HireApplicant.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};