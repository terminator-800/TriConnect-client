import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { ROLE } from '../../../../utils/role';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';
import Feedback from '../../../components/Feedback';
import { BrowseJobIcon, ManageJobPostIcon, ViewApplicantIcon, MessageIcon, SignOutIcon } from '../../../assets/icon2/icon2';

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
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={ROLE.MANPOWER_PROVIDER} />
      </div>

      {/* Sidebar */}
      <div className="fixed h-full bg-white text-white p-0 w-60 flex flex-col z-40">
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">

          {/* DASHBOARD */}
          <li
              className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/dashboard`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/dashboard`)}
            >
              <BrowseJobIcon size={25} />
              <span className="ml-3 font-medium">Dashboard</span>
          </li>

          {/* MANAGE JOB POST */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/manage`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/manage`)}
          >
              <ManageJobPostIcon size={23} />
              <span className="ml-3 font-medium">Manage Job Post</span>
          </li>

          {/* VIEW APPLICANT */}
          <li
              className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/view`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
              onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/view`)}
          >
            <ViewApplicantIcon size={25}/>
            <span className="ml-3 font-medium">View Applicants</span>
          </li>

            <li
            className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/create`) ? 'bg-gray-500' : ''} flex`}
          >
            <img src={icons.find_agency} alt="" className="ml-5 w-[27px]" />
            <button
              // onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/create`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              View Requests
            </button>
          </li>

          <li
            className={`${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/create`) ? 'bg-gray-500' : ''} flex`}
          >
            <img src={icons.manage_teams} alt="" className="ml-5 w-[27px]" />
            <button
              // onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/create`)}
              className="text-black hover:text-gray-300 ml-3 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Manage Teams
            </button>
          </li>

           {/* MESSAGES */}
            <li
                className={`flex items-center p-2 cursor-pointer transition-colors duration-200
                ${location.pathname.includes(`/${ROLE.MANPOWER_PROVIDER}/message`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
                onClick={() => navigate(`/${ROLE.MANPOWER_PROVIDER}/message`)}
            >
              <MessageIcon size={25} />
              <span className='ml-3 font-medium'>Messages</span>
            </li>

          {/* <li className="mt-auto flex justify-center">
            <button
              onClick={handleFeedbackOpen}
              className="text-black hover:text-gray-300 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              Add Feedback
            </button>
          </li> */}

          {/* SIGN OUT */}
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
        <Feedback onClose={handleFeedbackClose} role={ROLE.MANPOWER_PROVIDER} />
      )}
    </>
  );
};

export default Sidebar;
