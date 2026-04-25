import { useReportedUsers } from '../../../../../hooks/REPORT';
import { getInitials } from './helper';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import { useMessageHistory } from '../../../../../hooks/CHAT';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import ReportUser from '../../../../components/ReportUser/ReportUser';
import ActionMenu from './ActionMenu';
import HireApplicant from '../../../../components/HireApplicant/HireApplicant'; 
import RejectApplicant from '../../../../components/HireApplicant/RejectApplicant';
import icons from '../../../../assets/svg/Icons';
import FinalAgreementModal from '../../../../components/FinalAgreement/FinalAgreementModal';

const ChatHeader = ({ selectedUser } ) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false); 
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFinalAgreementModal, setShowFinalAgreementModal] = useState(false);
  const { data: employerProfile } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);
  const { data: messages = [] } = useMessageHistory(
    ROLE.INDIVIDUAL_EMPLOYER,
    selectedUser?.conversation_id
  );
  const { data: reportedUsers = [] } = useReportedUsers(ROLE.INDIVIDUAL_EMPLOYER);

  const isUserReported = reportedUsers.includes(selectedUser?.sender_id);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center p-4 border-b border-gray-300 bg-white text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  const authorizedPerson = selectedUser?.authorized_person || null;
  const latestOwnRequest = [...messages]
    .reverse()
    .find(
      (msg) =>
        msg.message_type === 'request' &&
        Number(msg.sender_id) === Number(employerProfile?.user_id) &&
        Number(msg.receiver_id) === Number(selectedUser?.sender_id)
    );
  const canShowFinalAgreement =
    selectedUser?.role === ROLE.MANPOWER_PROVIDER && latestOwnRequest?.request_status === 'accepted';

  const handleReportClick = () => {
    setShowActionMenu(false);
    setShowReportModal(true);
  };

  const handleAcceptClick = () => {
    setShowActionMenu(false);
    setShowHireModal(true); 
  };

  const handleDeclineClick = () => {
    setShowActionMenu(false);
    setShowRejectModal(true);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
      {selectedUser ? (
        <>
          <div className="flex items-center gap-3">
            {selectedUser.authorized_profile ? (
              <img
                src={selectedUser.authorized_profile}
                alt={authorizedPerson || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(authorizedPerson)}
              </div>
            )}

             <div className="text-sm text-gray-700">
                <span className="font-medium">
                  Sent by: <span className="font-bold">{authorizedPerson}</span>
                  {selectedUser.job_title && (
                    <>
                      {' '}| <span className="font-bold">{selectedUser.job_title}</span>
                    </>
                  )}
                </span>
              <div className="text-xs text-gray-500">
                {selectedUser.sent_at && `Last message: ${selectedUser.sent_at}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canShowFinalAgreement && (
              <button
                type="button"
                onClick={() => setShowFinalAgreementModal(true)}
                className="px-3 py-1.5 border border-[#2563EB] bg-white text-[#2563EB] text-sm font-medium cursor-pointer hover:bg-[#2563EB]/10 transition-colors"
              >
                Set Final Agreement
              </button>
            )}
            <ActionMenu
              isOpen={showActionMenu}
              onToggle={setShowActionMenu}
              onReportClick={handleReportClick}
              onAcceptClick={handleAcceptClick}
              onDeclineClick={handleDeclineClick}
              icons={icons}
            />
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center">Select a user to start chatting</div>
      )}

      {showReportModal && (
        <ReportUser
          reportedUser={selectedUser}
          conversationId={selectedUser.conversation_id}
          onClose={() => setShowReportModal(false)}
          role={ROLE.INDIVIDUAL_EMPLOYER}
        />
      )}

      {showFinalAgreementModal && (
        <FinalAgreementModal
          onClose={() => setShowFinalAgreementModal(false)}
          role={ROLE.INDIVIDUAL_EMPLOYER}
          selectedUser={selectedUser}
        />
      )}

      {showHireModal && (
        <HireApplicant
          selectedUser={selectedUser}
          role={ROLE.INDIVIDUAL_EMPLOYER}
          onClose={() => setShowHireModal(false)}
        />
      )}

       {showRejectModal && (
        <RejectApplicant
          selectedUser={selectedUser}
          role={ROLE.INDIVIDUAL_EMPLOYER}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;