import { useReportedUsers } from '../../../../../hooks/REPORT';
import { getInitials } from './helper';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import { useMessageHistory } from '../../../../../hooks/CHAT';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useQueryClient } from '@tanstack/react-query';
import ReportUser from '../../../../components/ReportUser/ReportUser';
import ActionMenu from './ActionMenu';
import icons from '../../../../assets/svg/Icons';
import HireApplicant from '../../../../components/HireApplicant/HireApplicant'; 
import RejectApplicant from '../../../../components/HireApplicant/RejectApplicant';
import axios from 'axios';

const ChatHeader = ({ selectedUser }) => {
  const queryClient = useQueryClient();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false); 
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptStatusModal, setShowAcceptStatusModal] = useState(false);
  const [acceptStatusMessage, setAcceptStatusMessage] = useState('');
  const { data: providerProfile } = useUserProfile(ROLE.MANPOWER_PROVIDER);
  const { data: messages = [] } = useMessageHistory(
    ROLE.MANPOWER_PROVIDER,
    selectedUser?.conversation_id
  );

  const { data: reportedUsers = [] } = useReportedUsers(ROLE.MANPOWER_PROVIDER);

  const isUserReported = reportedUsers.includes(selectedUser?.sender_id);
  
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center p-4 border-b border-gray-300 bg-white text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  const fullName =
  selectedUser?.authorized_person ||
  selectedUser?.agency_authorized_person ||
  selectedUser?.full_name ||
  selectedUser?.name ||
  selectedUser?.sender_name ||
  'Unknown';

  const initials = getInitials(fullName);
  const latestEmployerRequest = [...messages]
    .reverse()
    .find(
      (msg) =>
        msg.message_type === 'request' &&
        Number(msg.sender_id) === Number(selectedUser?.sender_id) &&
        Number(msg.receiver_id) === Number(providerProfile?.user_id)
    );
  const isAlreadyAccepted = latestEmployerRequest?.request_status === 'accepted';

  const handleReportClick = () => {
    setShowActionMenu(false);
    setShowReportModal(true);
  };

  const handleAcceptClick = async () => {
  setShowActionMenu(false);
    
    // Accept Employer logic
    if (selectedUser?.role === ROLE.BUSINESS_EMPLOYER || selectedUser?.role === ROLE.INDIVIDUAL_EMPLOYER) {
      if (isAlreadyAccepted) {
        setAcceptStatusMessage('You already accepted this employer request.');
        setShowAcceptStatusModal(true);
        return;
      }
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/manpower-provider/accept-employer`, {
          employerId: selectedUser.sender_id,        
          conversationId: selectedUser.conversation_id,
          referenceId: selectedUser.conversation_id,
        },
         {
          withCredentials: true,
         });
        queryClient.invalidateQueries({
          queryKey: ['messages', ROLE.MANPOWER_PROVIDER, selectedUser.conversation_id],
        });
        queryClient.invalidateQueries({
          queryKey: ['conversations', ROLE.MANPOWER_PROVIDER],
        });
        setAcceptStatusMessage('You accepted the employer request successfully.');
        setShowAcceptStatusModal(true);

      } catch (err) {
        console.error("Accept employer failed:", err);
      }
      return;
    }

    setShowHireModal(true);
  };


  const handleDeclineClick = async () => {
    setShowActionMenu(false);

    if (selectedUser?.role === ROLE.BUSINESS_EMPLOYER || selectedUser?.role === ROLE.INDIVIDUAL_EMPLOYER) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/manpower-provider/decline-employer`, {
          employerId: selectedUser.sender_id,        
          conversationId: selectedUser.conversation_id,
          referenceId: selectedUser.conversation_id,
        },
         {
          withCredentials: true, 
         });

      } catch (err) {
        console.error("Decline employer failed:", err);
      }
      return;
    }

    setShowRejectModal(true);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
      {selectedUser ? (
        <>
          <div className="flex items-center gap-3">
            {/* Authorized  Profile */}
            {selectedUser.profile ? (
              <img
                src={selectedUser.profile}
                alt={fullName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}

            {/* Details */}
            <div className="text-sm text-gray-700">
              <div className="font-medium">Sent by: {fullName || 'N/A'}
                 {selectedUser.job_title && (
                    <>
                      {' '}| <span className="font-bold">{selectedUser.job_title}</span>
                    </>
                  )}
              </div>

              {selectedUser.sent_at && (
                <div className="text-xs text-gray-500">
                  Last message: {selectedUser.sent_at || 'No messages yet'}
                </div>
              )}
            </div>
          </div>

          <ActionMenu
            isOpen={showActionMenu}
            onToggle={setShowActionMenu}
            onReportClick={handleReportClick}
            onAcceptClick={handleAcceptClick}
            onDeclineClick={handleDeclineClick}
            icons={icons}
            userRole={selectedUser.role} 
          />
        </>
      ) : (
        <div className="text-gray-400 text-center w-full">Select a user to start chatting</div>
      )}

      {showReportModal && (
        <ReportUser
          reportedUser={selectedUser}
          conversationId={selectedUser.conversation_id}
          onClose={() => setShowReportModal(false)}
          role={ROLE.MANPOWER_PROVIDER}
        />
      )}

      {showHireModal && (
        <HireApplicant
          selectedUser={selectedUser}
          role={ROLE.MANPOWER_PROVIDER}
          onClose={() => setShowHireModal(false)}
        />
      )}
      
      {showRejectModal && (
        <RejectApplicant
          selectedUser={selectedUser}
          role={ROLE.MANPOWER_PROVIDER}
          onClose={() => setShowRejectModal(false)}
        />
      )}

      {showAcceptStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
          <div className="w-full max-w-xl bg-white border border-gray-300 shadow-xl relative">
            <button
              onClick={() => setShowAcceptStatusModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            >
              ✕
            </button>
            <div className="p-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Employer Request</h2>
              <p className="text-gray-600">{acceptStatusMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;