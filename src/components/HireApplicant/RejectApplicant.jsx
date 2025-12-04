import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRejectApplication } from '../../../hooks/useRejectApplication';
import { useApplicants } from '../../../hooks/useApplicants';

export default function RejectApplicant({ selectedUser, onClose, role }) {
  if (!selectedUser) return null;
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const rejectMutation = useRejectApplication();
  const { data: applicantsData, refetch } = useApplicants(role);
  
  // Find the matching applicant from useApplicants data
  const applicant = applicantsData?.applicants?.find(
    app => app.applicant_user_id === selectedUser.id || 
           app.email === selectedUser.email ||
           app.applicant_name === selectedUser.name
  );
  
  const applicantName = applicant?.applicant_name || selectedUser?.authorized_person || selectedUser?.name || 'Applicant';
  
  const handleReject = async () => {
    if (!applicant?.application_id) {
      console.error('No application_id found');
      return;
    }
    
    try {
      await rejectMutation.mutateAsync({
        applicationId: applicant.application_id,
        role: role
      });
      setShowConfirmation(true);
      // Refetch applicants data after successful rejection
      await refetch();
    } catch (err) {
      // Error handling is done in the hook
      console.error('Rejection failed:', err);
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
            Are you sure you want to <span className="text-red-500 font-normal">decline</span> {applicantName} for the <span className='font-semibold'>{applicant?.job_title || selectedUser?.job_title}</span> position? 
          </h2>
          
          {rejectMutation.isError && (
            <p className="text-red-500 text-center mb-4">
              {rejectMutation.error?.response?.data?.message || 'Failed to reject applicant. Please try again.'}
            </p>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReject}
              disabled={rejectMutation.isPending || !applicant?.application_id}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejectMutation.isPending ? 'Processing...' : 'Yes'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={rejectMutation.isPending}
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
            {applicantName} has been rejected for the <span className="font-semibold">{applicant?.job_title || selectedUser?.job_title}</span> position.
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