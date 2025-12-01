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

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState(getTabFromLocalStorage);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: conversations = [], isLoading, isError } = useConversations(ROLE.BUSINESS_EMPLOYER);
  // console.log('conversation: ', conversations);
  
  const displayedUsers = filterAndMapConversations(conversations, activeTab);
  // console.log("Displayed Users: ", displayedUsers);
  
  const handleTabChange = (tab) => {
    saveTabToLocalStorage(tab);
    setActiveTab(tab);
  };
  // console.log('Selected:', selectedUser);
  return (
    <div className="">
      <Sidebar />
      <div className="pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <h1 className="text-2xl font-bold text-[#003479]">Messages</h1>
          <p>Keep in touch with employers and agencies — track your job conversations here</p>
        </div>
      </div>

      <div className="relative min-h-[75vh] bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-15">
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
                  onSelect={(user) => setSelectedUser(user)}/>
              <ChatWindow selectedUser={selectedUser}/>
              <MessageInput selectedUser={selectedUser}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
