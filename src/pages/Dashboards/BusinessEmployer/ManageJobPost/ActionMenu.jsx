import { useEffect, useRef } from 'react';
import icons from '../../../../assets/svg/Icons';

const ActionMenu = ({ isOpen, onToggle, onDeleteClick, onViewJobDetails }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => onToggle(true)}
        className="text-xl p-1 hover:bg-gray-200 rounded-full cursor-pointer"
      >
        <img src={icons.three_dots} alt="three dots" />
      </button>

      {isOpen && (
        <div className="absolute w-48 bg-white border border-gray-300 shadow-lg z-10">
          <ul className="text-sm text-gray-700">
            <li onClick={onViewJobDetails} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              View Job Details
            </li>

            {/* Temporary disabled this options because API not not returning applicants list just the count */}
            {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer b border-b border-[#D8D9DB]">
              View Applicants
            </li> */}

            <li
              onClick={onDeleteClick}
              className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
            >
              Remove Job
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
