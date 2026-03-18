import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { useState } from 'react';
import { ROLE } from '../../../../utils/role';
import Navbar from '../../Navbar';
import Feedback from '../../../components/Feedback';
import { BrowseJobIcon, FindAgencies, ManageJobPostIcon, ViewApplicantIcon, MessageIcon, SignOutIcon } from '../../../assets/icon2/icon2';

const Sidebar = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isLoading: isLoggingOut } = useLogout();

  const handleFeedbackOpen = () => {
    setFeedbackModalVisible(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackModalVisible(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    await logout();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={ROLE.INDIVIDUAL_EMPLOYER} />
      </div>

      {/* Sidebar */}
      <div className="fixed h-full bg-white text-white p-0 w-60 flex flex-col z-40">
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">
          {/* DASHBOARD */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.INDIVIDUAL_EMPLOYER}/dashboard`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.INDIVIDUAL_EMPLOYER}/dashboard`)}
          >
            <BrowseJobIcon size={25} />
            <span className="ml-3 font-medium">Dashboard</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
           ${location.pathname.includes(`/${ROLE.INDIVIDUAL_EMPLOYER}/manage`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.INDIVIDUAL_EMPLOYER}/manage`)}
          >
            <ManageJobPostIcon size={25} />
            <span className="ml-3 font-medium">Manage Job Posts</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.INDIVIDUAL_EMPLOYER}/view`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.INDIVIDUAL_EMPLOYER}/view`)}
          >
            <ViewApplicantIcon size={25} />
            <span className="ml-3 font-medium">View Applicant</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
          ${location.pathname.includes(`/${ROLE.INDIVIDUAL_EMPLOYER}/find`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.INDIVIDUAL_EMPLOYER}/find`)}
          >
            <FindAgencies size={25} />
            <span className="ml-3 font-medium">Find Agencies</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
          ${location.pathname.includes(`/${ROLE.INDIVIDUAL_EMPLOYER}/message`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.INDIVIDUAL_EMPLOYER}/message`)}
          >
            <MessageIcon size={25} />
            <span className="ml-3 font-medium">Messages</span>
          </li>

          {/* <li className="mt-auto flex justify-center">
            <button
              onClick={handleFeedbackOpen}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Add Feedback
            </button>
          </li> */}

          <li className="mt-auto flex justify-center mb-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-black hover:text-[#2563EB] transition-colors duration-200 bg-transparent border-none cursor-pointer p-2 font-medium"
              >
                {isLoggingOut ? (
                  "Signing out..."
                ) : (
                  <>
                    <SignOutIcon size={25}/>
                    <span>Sign Out</span>
                  </>
                )}
            </button>
          </li>
        </ul>
      </div>

      {/* Feedback Modal */}
      {feedbackModalVisible && (
        <Feedback onClose={handleFeedbackClose} role={ROLE.INDIVIDUAL_EMPLOYER} />
      )}
    </>
  );
};

export default Sidebar;
