import PropTypes from 'prop-types';

const ActionMenu = ({ isOpen, onToggle, onReportClick, onAcceptClick, onDeclineClick, icons, }) => {

  const handleAcceptClick = () => {
  onAcceptClick();
  onToggle(false);
};

const handleDeclineClick = () => {
  onDeclineClick();
  onToggle(false);
};

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => onToggle(!isOpen)}
          className="text-xl p-1 hover:bg-gray-200 cursor-pointer h-3 w-3 flex items-center justify-center"
        >
          <img src={icons.three_dots_vertical} alt="menu" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg z-10">
            <ul className="text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={onReportClick}>
                Report Applicant
              </li>

              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-[#D8D9DB] text-[#55C463]"
                onClick={handleAcceptClick}
              >
                Hire Applicant
              </li>

              <li
                className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                onClick={handleDeclineClick}
              >
                Reject Applicant
              </li>
            </ul>
          </div>
        )}
      </div>

    </>
  );
};

ActionMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onReportClick: PropTypes.func.isRequired,
  onAcceptClick: PropTypes.func,
  onDeclineClick: PropTypes.func,
  icons: PropTypes.object.isRequired,
};

export default ActionMenu;