const RequestSuccessModal = ({ isOpen, onClose, workerDetails }) => {
  if (!isOpen) return null;
  console.log('Worker Details in Success Modal:', workerDetails);
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 ml-55">
      <div className="backdrop-blur-2xl max-w-2xl w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 text-xl font-bold"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Request Submitted!
          </h2>
          <p className="text-lg text-gray-600">
            Your request for{' '}
            <span className="font-semibold text-gray-900">
              {workerDetails?.worker_category || 'Manpower'}
            </span>
            {workerDetails?.agency_name && (
              <>
                {' '}at{' '}
                <span className="font-semibold text-gray-900">
                  {workerDetails.agency_name}
                </span>
              </>
            )}
            {' '}has been successfully submitted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccessModal;