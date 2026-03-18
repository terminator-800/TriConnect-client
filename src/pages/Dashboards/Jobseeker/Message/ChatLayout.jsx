import { filterAndMapConversations, getTabFromLocalStorage, saveTabToLocalStorage } from './helper';
import { useConversations } from '../../../../../hooks/CHAT';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import ChatTabs from './ChatTabs';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import ConversationList from './ConversationLists';
import DisabledAccount from '../../../../components/DisabledAccount';
import VerificationStatus from '../Verification Form/VerificationStatus';
import Form from '../Verification Form/Form';
import Navbar from '../../../Navbar';

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError: errorProfile,
    refetch,
  } = useUserProfile(ROLE.JOBSEEKER);

  const { data: conversations = [], isLoading, isError } = useConversations(ROLE.JOBSEEKER);

  const displayedUsers = filterAndMapConversations(conversations, activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    saveTabToLocalStorage(tab);
  };

  const openForm = () => setShowForm(true);

  if (loadingProfile) {
    return (
      <>
        <Sidebar />
        <div className="pl-70 pr-10 pt-30 min-h-screen">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  if (errorProfile) {
    return (
      <>
        <Sidebar />
        <div className="pl-70 pr-10 pt-30 min-h-screen">
          <div>Failed to fetch profile data.</div>
        </div>
      </>
    );
  }

  // Check if hired - show disabled account
  if (profileData.is_verified && profileData.employment_status === 'hired') {
    return (
      <>
        <Sidebar />
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
          <DisabledAccount
            contractData={{
              employer: profileData.employer_name,
              job_title: profileData.job_title,
              start_date: profileData.contract_start_date,
              end_date: profileData.contract_end_date,
            }}
          />
        </div>
      </>
    );
  }

  // Check if not verified - show verification status
  if (!profileData.is_verified) {
    return (
      <>
        <Sidebar />
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 md:pl-70 pr-4 md:pr-10 pt-10 md:pt-30">
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-0 md:px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
          </div>

          {showForm && (
            <Form
              onClose={() => setShowForm(false)}
              onSubmitSuccess={() => {
                setShowForm(false);
                refetch();
              }}
            />
          )}
        </div>
      </>
    );
  }

  // If verified and not hired, show normal Chat page
  return (
    <>
      <Sidebar />
      <div className="px-4 pt-30 2xl:pl-65 xl:pl-65">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-900">Messages</h1>
            <p className="text-gray-600">
              View and manage conversations with job seekers and agencies
            </p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[75vh] bg-linear-to-b from-white to-[#00C2CB] px-4 pt-10 2xl:pl-65 xl:pl-65">
        <div className="bg-white rounded shadow-md mx-auto h-[600px] flex flex-col border border-gray-300">
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT SIDE - Collapsible on mobile, always visible on desktop */}
            <>
              {/* Backdrop for mobile only */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 z-40 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              <div
                className={`
                border-r border-gray-300 transition-all duration-300 md:mx-0 mx-4
                flex flex-col
                md:relative md:flex md:w-[500px] 
                ${
                  isSidebarOpen
                    ? 'absolute top-10 left-0 bottom-0 w-[85%] max-w-[500px] z-50 bg-white shadow-2xl'
                    : 'hidden md:flex'
                }
              `}
              >
                <ChatTabs
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  setSelectedUser={setSelectedUser}
                />

                <div className="flex-1 overflow-y-auto">
                  <ConversationList
                    users={displayedUsers}
                    selectedUser={selectedUser}
                    onSelect={(user) => {
                      setSelectedUser(user);
                      setIsSidebarOpen(false);
                    }}
                  />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col flex-1 border-l border-gray-300">
                {/* Toggle Button - Animated hamburger to X transformation */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden absolute top-0 left-4 z-10 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
                    <span
                      className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                        isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                        isSidebarOpen ? 'opacity-0' : ''
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                        isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''
                      }`}
                    />
                  </div>
                </button>

                <ChatHeader selectedUser={selectedUser} />
                <ChatWindow selectedUser={selectedUser} />
                <MessageInput selectedUser={selectedUser} />
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
