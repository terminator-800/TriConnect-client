import icons from '../../../../assets/svg/Icons';

const ReviewApplication = ({
  applicationData = {
    full_name: '',
    email_address: '',
    phone_number: '',
    current_address: '',
    resume: null,
    cover_letter: '',
    job_title: '',
    company_name: '',
  },
  onSubmit = () => {},
  onBack = () => {},
  isSubmitting = false,
}) => {
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="backdrop-blur-2xl w-full max-w-7xl border border-gray-300 shadow-2xl flex flex-col ml-55">
      {/* Header */}
      <div className="flex justify-between items-start p-8 max-[769px]:p-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 max-[769px]:text-xl">
            Review Your Application
          </h2>
          <p className="text-sm text-gray-600">Please review your information before submitting</p>
        </div>
        <button
          onClick={onBack}
          aria-label="Go back to form"
          disabled={isSubmitting}
          className="text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ml-4 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-8 max-[769px]:p-4 max-h-[50vh] overflow-y-auto">
        {/* Note Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> By submitting this application, you agree to share your
            information with the employer and confirm that all details provided are accurate.
          </p>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">
              <img src={icons.personal_information} alt="Personal information icon" />
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>

          <div className="space-y-1 mb-6 ">
            <div className="flex gap-5 items-start py-3 border-b border-gray-200 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Full Name:</span>
              <span className="text-gray-900">{applicationData.full_name || 'N/A'}</span>
            </div>

            <div className="flex gap-5 items-start py-3 border-b border-gray-200 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-900">{applicationData.email_address || 'N/A'}</span>
            </div>

            <div className="flex gap-5 items-start py-3 border-b border-gray-200 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-900">{applicationData.phone_number || 'N/A'}</span>
            </div>

            <div className="flex gap-5 items-start py-3 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Address:</span>
              <span className="text-gray-900">{applicationData.current_address || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-300"></div>

        {/* Documents Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">
              <img src={icons.resume} alt="Resume icon" />
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex gap-5 items-start py-3 border-b border-gray-200 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Resume:</span>
              <span className="text-gray-900">
                {applicationData.resume?.name || 'Not attached'}
              </span>
            </div>

            <div className="flex gap-5 items-start py-3 max-[769px]:flex-col">
              <span className="text-gray-600 font-medium">Cover Letter:</span>
              <span className="text-gray-900">
                {applicationData.cover_letter ? 'Provided' : 'Not provided'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Buttons */}
      <div className="flex justify-center gap-4 p-8 max-[769px]:flex-col max-[769px]:p-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-label="Submit application"
          className={`px-10 py-1 text-white font-semibold cursor-pointer transition min-w-40 max-[769px]:min-w-0 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed opacity-50'
              : 'bg-blue-600 hover:bg-blue-700 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>

        <button
          onClick={onBack}
          disabled={isSubmitting}
          aria-label="Go back to edit form"
          className={`px-10 py- text-white font-semibold cursor-pointer transition min-w-40 max-[769px]:min-w-0 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed opacity-50'
              : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed'
          }`}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ReviewApplication;
