import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRejectApplication } from '../../../hooks/useRejectApplication';
import { useApplicants } from '../../../hooks/useApplicants';
import { useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../../../utils/role';

export default function RejectApplicant({ selectedUser, onClose, role }) {
  if (!selectedUser) return null;
  
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const rejectMutation = useRejectApplication();
  const { data: applicantsData } = useApplicants(role);
  
  // Find the matching applicant from useApplicants data
  const applicant = applicantsData?.applicants?.find(
    app => app.applicant_user_id === selectedUser.sender_id ||  // ✅ Use sender_id instead of id
           app.email === selectedUser.email ||
           app.applicant_name === selectedUser.name
  );
  
  const applicantName = applicant?.applicant_name || selectedUser?.authorized_person || selectedUser?.name || 'Applicant';
  const isManpowerProvider = role === ROLE.MANPOWER_PROVIDER;
  
  const handleReject = async () => {
    try {
      // Prepare the rejection data
      const rejectionData = {
        role,
      };

      // ✅ For manpower provider: application_id is optional, use applicant_id as fallback
      if (isManpowerProvider) {
        if (applicant?.application_id) {
          rejectionData.application_id = applicant.application_id;
        } else {
          // ✅ Use sender_id from selectedUser or applicant_user_id from applicant
          const applicantId = selectedUser?.sender_id || applicant?.applicant_user_id;
          
          if (!applicantId) {
            console.error('❌ No applicant_id found');
            alert('Cannot reject: Missing applicant information');
            return;
          }
          
          rejectionData.applicant_id = applicantId;
        }
      } else {
        // ❌ For other roles: application_id is required
        if (!applicant?.application_id) {
          console.error('No application_id found');
          return;
        }
        rejectionData.application_id = applicant.application_id;
      }

      console.log('🚀 Sending rejection data:', rejectionData);
      
      await rejectMutation.mutateAsync(rejectionData);
      
      // Invalidate all related queries after successful rejection
      await queryClient.invalidateQueries({ queryKey: ['applicants'] });
      await queryClient.invalidateQueries({ queryKey: ['rejected-applicants'] });
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      await queryClient.invalidateQueries({ queryKey: ['messages', role, selectedUser.conversation_id] });
      
      setShowConfirmation(true);
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

  // ✅ Manpower provider can always reject (with application_id OR applicant_id)
  // ❌ Others need application_id
  const canReject = isManpowerProvider 
    ? !!(applicant?.application_id || selectedUser?.sender_id)  // ✅ Check sender_id exists
    : !!applicant?.application_id;  // Require application_id for others

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 ml-55">
      {!showConfirmation ? (
        <div className="backdrop-blur-2xl shadow-lg p-12 max-w-5xl w-full">
          <h2 className="text-2xl font-normal text-[#2C3E50] text-center mb-8">
            Are you sure you want to <span className="text-red-500 font-normal">decline</span> {applicantName} for the <span className='font-semibold'>{applicant?.job_title || selectedUser?.job_title}</span> position? 
          </h2>
          
          {rejectMutation.isError && (
            <p className="text-red-500 text-center mb-4">
              {(() => {
                const data = rejectMutation.error?.response?.data;
                const text = data?.message || data?.error || '';

                if (text.includes('already rejected')) {
                  return `${applicantName} has already been rejected for this position.`;
                }

                return text || 'Failed to reject applicant. Please try again.';
              })()}
            </p>
          )}
                    
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReject}
              disabled={rejectMutation.isPending || !canReject}
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