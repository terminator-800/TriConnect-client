import React from 'react';
import PropTypes from 'prop-types';

const SuccessfullyDeleted = ({ jobTitle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="backdrop-blur-2xl p-8 py-20 shadow-lg max-w-5xl w-full relative border border-white ml-60 mt-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-[#2C3E50] text-center mb-4 text-3xl font-semibold">
          Successfully Deleted!
        </h1>
        <p className="text-[#6B7280] text-center text-lg">
          "{jobTitle}" has been permanently removed
        </p>
      </div>
    </div>
  );
};

SuccessfullyDeleted.propTypes = {
  jobTitle: PropTypes.string.isRequired,
};

export default SuccessfullyDeleted;
