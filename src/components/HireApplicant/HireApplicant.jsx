import { useState } from 'react';
import PropTypes from 'prop-types';

export default function HireApplicant({ selectedUser, onClose }) {
  if (!selectedUser) return null;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const applicantName = selectedUser?.authorized_person || selectedUser?.name || 'Applicant';
  console.log(selectedUser, "HIRE MODAL");
    
  const handleConfirmHire = () => {
    if (!startDate || !endDate) {
      alert('Please fill in both start and end dates');
      return;
    }
    
    setShowConfirmation(true);
    // You can add API call here to accept the applicant with contract dates
    console.log('Accepting applicant:', {
      ...selectedUser,
      startDate,
      endDate
    });
  };

  const handleClose = () => {
    setShowConfirmation(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {!showConfirmation ? (
        <div className="backdrop-blur-2xl shadow-lg p-8 max-w-2xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Set Employment Contract
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleConfirmHire}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-1 transition-colors cursor-pointer"
            >
              Confirm & Hire
            </button>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-2xl shadow-lg p-12 max-w-3xl w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
          
          <h2 className="text-3xl font-normal text-[#55C463] text-center mb-6">
            Applicant Pending Confirmation
          </h2>
          
          <p className="text-[#6B7280] text-center text-lg leading-relaxed">
            {applicantName} has been selected for the <span className="font-semibold text-gray-800">{selectedUser?.job_title}</span> position.
          </p>
          
          <p className="text-[#6B7280] text-center text-lg leading-relaxed mt-2">
            The applicant's response is <span className="font-semibold text-gray-800">awaited</span> to confirm acceptance. Once confirmed, they will be moved to your <span className="font-semibold text-gray-800">Hired Applicants list</span>.
          </p>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Contract Period: <span className="font-semibold">{startDate}</span> to <span className="font-semibold">{endDate}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

HireApplicant.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};