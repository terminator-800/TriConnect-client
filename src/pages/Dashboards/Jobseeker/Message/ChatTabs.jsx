const ChatTabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabClasses = (tab) =>
    `md:w-1/2 text-center py-2 md:border-b-2 border-b transition-colors duration-150 ${
      activeTab === tab ? 'border-blue-700 text-[#2563EB]' : 'border-transparent text-gray-500'
    }`;

  return (
    <div className="flex bg-white md:w-[500px] lg:flex-row md:flex-row flex-col ">
      <button
        onClick={() => handleTabClick('employer')}
        className={`${tabClasses('employer')} cursor-pointer`}
      >
        Employer's
      </button>
      <button
        onClick={() => handleTabClick('manpower-provider')}
        className={`${tabClasses('manpower-provider')} cursor-pointer`}
      >
        Manpower Provider
      </button>
    </div>
  );
};

export default ChatTabs;
