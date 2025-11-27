import { filterAndMapConversations, getTabFromLocalStorage, saveTabToLocalStorage } from './helper';
import { useConversations } from '../../../../../hooks/CHAT';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import ChatTabs from './ChatTabs';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import ConversationList from './ConversationLists';

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: conversations = [], isLoading, isError } = useConversations(ROLE.JOBSEEKER);

  const displayedUsers = filterAndMapConversations(conversations, activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    saveTabToLocalStorage(tab);
  };

  return (
    <>
      <Sidebar />
      <div className="pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-900">Messages</h1>
            <p className="text-gray-600">
              Keep in touch with employers and agencies — track your job conversations here
            </p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[75vh] bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-15">
        <div className="bg-white rounded shadow-md mx-auto h-[600px] flex flex-col border border-gray-300">
          <div className="flex flex-1 overflow-hidden">
            <div className="border-r border-gray-300">
              <ChatTabs
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                setSelectedUser={setSelectedUser}
              />

              <div className="flex-1">
                <ConversationList
                  users={displayedUsers}
                  selectedUser={selectedUser}
                  onSelect={setSelectedUser}
                />
              </div>
            </div>

            <div
              className="flex flex-col flex-1 border-l border-gray-300
              "
            >
              <ChatHeader selectedUser={selectedUser} />
              <ChatWindow selectedUser={selectedUser} />
              <MessageInput selectedUser={selectedUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
