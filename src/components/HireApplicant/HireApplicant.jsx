import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useUserProfile } from '../../../hooks/useUserProfiles';

export default function HireApplicant({ selectedUser, onClose, role }) {
  if (!selectedUser) return null;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: profileData } = useUserProfile(role);
    
  const employerName = profileData?.business_name || profileData?.full_name || 'Employer';
  const applicantName = selectedUser?.authorized_person || selectedUser?.name || 'Applicant';

  const handleConfirmHire = async () => {
    console.log('🔍 Dates before validation:', { startDate, endDate });
    
    if (!startDate || !endDate) {
      setError('Please fill in both start and end dates');
      return;
    }

    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Prepare the payload
    const payload = {
      employee_id: selectedUser.sender_id, 
      job_title: selectedUser.job_title,
      start_date: startDate,
      end_date: endDate,
      conversation_id: selectedUser.conversation_id,
      full_name: applicantName,
      employer_name: employerName,
      hire_message: `By accepting this offer, your account will be temporarily disabled from ${startDate} until ${endDate}. This means you will not be able to apply for other jobs or access job-seeking features during your employment. Your account will be automatically reactivated once your employment/contract period ends. Do you accept this job offer?`
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${role}/hire-applicant`,
        payload,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('✅ Hire response:', response.data);
      setShowConfirmation(true);
      
    } catch (err) {
      console.error('❌ Error hiring applicant:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      setError(
        err.response?.data?.message || 'Failed to hire applicant. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setError('');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 ml-55">
      {!showConfirmation ? (
        <div className="backdrop-blur-2xl shadow-lg p-8 max-w-3xl w-full relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Set Employment Contract
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
              ✕ {error}
            </div>
          )}

      
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  console.log('📅 Start date changed to:', e.target.value);
                  setStartDate(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  console.log('📅 End date changed to:', e.target.value);
                  setEndDate(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleConfirmHire}
              disabled={isLoading}
              className={`font-medium px-10 py-1 transition-colors ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              } text-white`}
            >
              {isLoading ? 'Processing...' : 'Confirm & Hire'}
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
  role: PropTypes.string.isRequired,
};