import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../../../hooks/useLogout';
import { useState } from 'react';
import { ROLE } from '../../../../utils/role';
import Navbar from '../../Navbar';
import icons from '../../../assets/svg/Icons';
import {
  BrowseJobIcon,
  UserVerificationIcon,
  VerifiedUserIcon,
  JobPostVerificationIcon,
  VerifiedJobPostIcon,
  ReportedUsersIcon,
  UsersFeedbackIcon,
  SignOutIcon,
  ManpowerProviderIcon,
} from '../../../assets/icon2/icon2';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    await logout();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={ROLE.ADMINISTRATOR} />
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
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <ul className="list-none p-0 space-y-4 flex-1 flex flex-col mb-6 mt-28">
          {/* Profile Admin */}
          <div className="flex flex-col items-center justify-center gap-2 pt-5">
            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
            <h1 className="text-blue-900 font-bold italic">Administrator</h1>
          </div>

          {/* DASHBOARD */}
          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/dashboard`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/dashboard`)}
          >
            <BrowseJobIcon size={25} />
            <span className="ml-3 font-medium">Dashboard</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/verification`) && !location.pathname.includes('deployment') ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verification`)}
          >
            <UserVerificationIcon size={25} />
            <span className="ml-3 font-medium">User Verification</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/deployment-verification`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/deployment-verification`)}
          >
            <ManpowerProviderIcon size={25} className="shrink-0" />
            <span className="ml-3 font-medium text-sm whitespace-nowrap">Deployment Verification</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname === `/${ROLE.ADMINISTRATOR}/verified` ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verified`)}
          >
            <VerifiedUserIcon size={25} />
            <span className="ml-3 font-medium">Verified Users</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname === `/${ROLE.ADMINISTRATOR}/job-post-verification` ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/job-post-verification`)}
          >
            <JobPostVerificationIcon size={25} />
            <span className="ml-3 font-medium">Job Post Verification</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/verified-job-post`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/verified-job-post`)}
          >
            <VerifiedJobPostIcon size={25} />
            <span className="ml-3 font-medium">Verified Job Post</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/reported`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/reported`)}
          >
            <ReportedUsersIcon size={27} />
            <span className="ml-3 font-medium">Reported Users</span>
          </li>

          <li
            className={`flex items-center p-2 cursor-pointer transition-colors duration-200
              ${location.pathname.includes(`/${ROLE.ADMINISTRATOR}/feedback`) ? 'bg-[#5ED1D625] text-[#2563EB]' : 'text-black'} hover:text-[#2563EB] pl-5`}
            onClick={() => navigate(`/${ROLE.ADMINISTRATOR}/feedback`)}
          >
            <UsersFeedbackIcon size={27} />
            <span className="ml-3 font-medium">Users Feedback</span>
          </li>

          <li className="mt-auto flex justify-center mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-black hover:text-[#2563EB] transition-colors duration-200 bg-transparent border-none cursor-pointer p-2 font-medium"
            >
              {isLoggingOut ? (
                'Signing out...'
              ) : (
                <>
                  <SignOutIcon size={25} />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
