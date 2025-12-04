import { useReportedUsers } from '../../../../../hooks/REPORT';
import { getInitials } from './helper';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import ReportUser from '../../../../components/ReportUser/ReportUser';
import ActionMenu from './ActionMenu';
import icons from '../../../../assets/svg/Icons';
import HireApplicant from '../../../../components/HireApplicant/HireApplicant'; 
import RejectApplicant from '../../../../components/HireApplicant/RejectApplicant';

const ChatHeader = ({ selectedUser }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false); 
  const [showRejectModal, setShowRejectModal] = useState(false);
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
            {/* Authorized  Profile */}
            {selectedUser.authorized_profile ? (
              <img
                src={selectedUser.authorized_profile}
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
              <div className="font-medium">Sent by: {fullName || 'N/A'}</div>

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
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;