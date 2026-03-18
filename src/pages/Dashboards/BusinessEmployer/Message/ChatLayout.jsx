import { getTabFromLocalStorage, saveTabToLocalStorage, filterAndMapConversations } from './helper';
import { useConversations } from '../../../../../hooks/CHAT';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import ChatTabs from './ChatTabs';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import ConversationList from './ConversationLists';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import VerificationStatus from '../../../Dashboards/BusinessEmployer/VerificationForm/VerificationStatus';
import Form from '../VerificationForm/Form';

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { data: conversations = [], isLoading, isError } = useConversations(ROLE.BUSINESS_EMPLOYER);
  
  const displayedUsers = filterAndMapConversations(conversations, activeTab);
  const {
    data: employer = null,
    isLoading: isEmployerLoading,
    error,
    refetch,
  } = useUserProfile(ROLE.BUSINESS_EMPLOYER);

  const handleTabChange = (tab) => {
    saveTabToLocalStorage(tab);
    setActiveTab(tab);
  };

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  if (isEmployerLoading) return <div className="p-10">Loading...</div>;
  return (
    <div className="">
      <Sidebar />

      {employer && employer.is_verified ? (
        <>
          <div className="pl-70 pr-10 pt-30">
            <div className="bg-white shadow-md py-6 px-10 mb-8">
              <h1 className="text-2xl font-bold text-[#2563EB]">Messages</h1>
              <p>Keep in touch with employers and agencies — track your job conversations here</p>
            </div>
          </div>
          <div className="relative min-h-[75vh] bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-15">
            <div className="bg-white rounded shadow-md mx-auto h-[600px] flex flex-col border border-gray-300">
              <div className="flex flex-1 overflow-hidden">
                <div className=" border-r border-gray-300">
                  <ChatTabs
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    setSelectedUser={setSelectedUser}
                  />

                  <ConversationList
                    users={displayedUsers}
                    selectedUser={selectedUser}
                    onSelect={setSelectedUser}
                  />
                </div>

                <div className="flex flex-col flex-1 border-l border-gray-300">
                  <ChatHeader
                    selectedUser={selectedUser}
                    onSelect={(user) => setSelectedUser(user)}
                  />
                  <ChatWindow selectedUser={selectedUser} />
                  <MessageInput selectedUser={selectedUser} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
            <VerificationStatus profileData={employer} openForm={openForm} />
          </div>
        </div>
      )}

      {showForm && (
        <Form
          onClose={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
          }}
          onSubmitSuccess={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ChatLayout;
