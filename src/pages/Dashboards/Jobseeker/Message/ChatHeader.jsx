import { useReportedUsers } from '../../../../../hooks/REPORT';
import { getInitials } from './helper';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import ReportUser from '../../../../components/ReportUser/ReportUser';
import icons from '../../../../assets/svg/Icons';

const ChatHeader = ({ selectedUser }) => {
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: reportedUsers = [] } = useReportedUsers(ROLE.JOBSEEKER);

  // reportedUsers might be an array of objects like { reported_user_id: 12, reason: 'spam' }
const isUserReported = reportedUsers.some(
  (user) => user.reported_user_id === selectedUser?.sender_id
);

  
  const authorizedPerson =
    selectedUser?.agency_authorized_person || selectedUser?.name || null;

  const displayProfile = selectedUser?.profile || null;
  
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center p-4 border-b border-gray-300 bg-white text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white md:flex-row flex-col">
      {selectedUser ? (
        <>
          <div className="flex items-center gap-3">

          
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white overflow-hidden">
              {/* Authorized Persons */}
              {displayProfile ? (
                <img
                  src={displayProfile}
                  alt={authorizedPerson}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(authorizedPerson) || 'unknown'
              )}
            </div>

            <div className="">

              {/* NAME */}
              <span
                className="font-bold text-lg truncate block 
              max-[601px]:w-100
              // max-[538px]:w-100
              max-[425px]:w-50
              "
              >
              {authorizedPerson || 'loading...'}
              </span>

              {/* LAST MESSAGE */}
            {/* 
              <div
                className="text-xs text-gray-500 truncate block 
              max-[538px]:w-20
              max-[426px]:w-10"
              >
                {selectedUser.sent_at && `Last message: ${selectedUser.sent_at}`}
              </div> */}
            </div>
          </div>

          {!isUserReported && (
            <button
              className="text-red-500 text-xl font-bold cursor-pointer"
              onClick={() => setShowReportModal(true)}
            >
              {/* Report ICON */}
              <img src={icons.report_user} alt="report user" />
            </button>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center">Select a user to start chatting</div>
      )}

      {showReportModal && (
        <ReportUser
          reportedUser={selectedUser}
          conversationId={selectedUser.conversation_id}
          onClose={() => setShowReportModal(false)}
          role={ROLE.JOBSEEKER}
        />
      )}
    </div>
  );
};

export default ChatHeader;
