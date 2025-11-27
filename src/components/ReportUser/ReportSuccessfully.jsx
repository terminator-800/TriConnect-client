import React from "react";

const ReportSuccessfully = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ml-55">
      <div className="px-10 py-10 max-w-5xl w-full relative shadow-xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-center text-[#55C463] text-3xl mb-4">
          Report Successfully Submitted!
        </h2>

        {/* Message */}
        <p className="text-center text-[#6B7280] text-base leading-relaxed">
          Thank you for helping us maintain a safe and trustworthy platform.
          <br />
          Your report is now <span className="font-semibold">
            under review
          </span>{" "}
          by our admin team.
        </p>
      </div>
    </div>
  );
};

export default ReportSuccessfully;
