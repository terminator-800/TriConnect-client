const ApplicantMenu = ({ onRejectClick, onViewProfileClick, onMessageClick }) => {
  return (
    <div className="absolute right-10 top-10 bg-white border border-gray-300 shadow-md z-10 p-2">
      <ul className="text-black">
        {/* View Profile */}
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
          onClick={onViewProfileClick}
        >
          View Profile
        </li>

        {/* Message Applicant */}
        {/* <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-[#D8D9DB]"
          onClick={onMessageClick}
        >
          Message Applicant
        </li> */}

        {/* Reject Applicant */}
        {/* <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
          onClick={onRejectClick}
        >
          Reject Applicant
        </li> */}

      </ul>
    </div>
  );
};

export default ApplicantMenu;
