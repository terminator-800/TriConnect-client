import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { useState } from 'react';
import { ROLE } from '../../../../utils/role';
import icons from '../../../assets/svg/Icons';
import Navbar from '../../Navbar';
import Feedback from '../../../components/Feedback';
import {
  SignOutIcon,
  BrowseJobIcon,
  FindAgencies,
  MessageIcon,
  ManageJobPostIcon,
} from '../../../assets/icon2/icon2';

const Sidebar = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
        <Navbar userType={ROLE.JOBSEEKER} />
      </div>

      {/* Toggle button (hamburger / close icon) */}
      <button
        className="block lg:hidden fixed top-[100px] left-4 z-50 bg-gray-800 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-white text-white p-0 w-60 flex flex-col z-40 transform transition-transform duration-300
                    ${isOpen ? 'translate-x-0 pt-10' : '-translate-x-full'} 
                    lg:translate-x-0 lg:pt-0`}
      >
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-30">

          {/* BROWSE JOB */}
          <li 
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.JOBSEEKER}/jobs`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black' } 
            hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.JOBSEEKER}/jobs`)}
          >
            <BrowseJobIcon size={25}/>
            <span className="ml-3 font-medium">Browse Job</span>
          </li>

          {/* FIND AGENCIES */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.JOBSEEKER}/agencies`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} flex
            hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.JOBSEEKER}/agencies`)}
          >
            <FindAgencies size={25}/>
            <span className="ml-3 font-medium">Find Agencies</span>
          </li>

          {/* SAVED JOBS */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.JOBSEEKER}/saved-jobs`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} flex
            hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.JOBSEEKER}/saved-jobs`)}
          >
            <ManageJobPostIcon size={25} />
            <span className="ml-3 font-medium">Saved Job</span>
          </li>

          {/* MESSAGES */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
            ${location.pathname.includes(`/${ROLE.JOBSEEKER}/message`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} flex
             hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.JOBSEEKER}/message`)}
          >
            <MessageIcon size={25}/>
              <span className='ml-3 font-medium'>Messages</span>
          </li>

        
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
      {feedbackModalVisible && <Feedback onClose={handleFeedbackClose} role={ROLE.JOBSEEKER} />}
    </>
  );
};

export default Sidebar;
