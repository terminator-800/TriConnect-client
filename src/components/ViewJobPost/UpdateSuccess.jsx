const UpdateSuccess = ({ onClose }) => {  
  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-opacity-50 ml-60 mt-7 ">  
      <div className="backdrop-blur-2xl shadow-lg w-full max-w-4xl relative border border-white px-8 py-10">
        {/* Close Button */}
        <button
          onClick={onClose}  
          className="absolute top-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
          aria-label="Close"
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

        {/* Content */}
        <div className="text-center py-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Job Updated Successfully!
          </h1>
          <p className="text-[#6B7280] text-lg">
            Your job post has been updated
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateSuccess;