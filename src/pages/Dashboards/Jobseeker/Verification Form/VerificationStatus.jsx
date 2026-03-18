import icons from '../../../../assets/svg/Icons';

const VerificationStatus = ({ profileData, openForm }) => {
  if (profileData.is_rejected) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="bg-yellow-100 p-6 shadow-md flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <div className="flex gap-4 items-center flex-col sm:flex-row text-center sm:text-left">
            <img src={icons.not_verified} alt="Not Verified" className="w-11" />
            <div>
              <h1 className="font-bold text-xl md:text-2xl text-yellow-900">
                Submitted Requirements Rejected
              </h1>
              <p className="text-yellow-900 text-sm md:text-base max-w-3xl">
                Your verification details were rejected due to inaccurate information or invalid
                documents. Please review and resubmit the correct details and files.
              </p>
            </div>
          </div>

          <button className="bg-green-600 text-white px-10 py-1 cursor-pointer whitespace-nowrap self-stretch md:self-auto" onClick={openForm}>
            Verify Now
          </button>
        </div>
      </div>
    );
  }

  if (profileData.is_submitted) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="bg-yellow-100 p-6 shadow-md flex justify-between items-center w-full flex-col sm:flex-row gap-4">
          <div className="flex gap-4 items-center flex-col sm:flex-row text-center sm:text-left">
            <img src={icons.not_verified} alt="Not Verified" className="w-11" />
            <div>
              <h1 className="font-bold text-xl md:text-2xl text-yellow-900">Waiting for verification...</h1>
              <p className="text-yellow-900 text-sm md:text-base max-w-md">
                Wait 3 days for the administrator to verify.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-yellow-100 p-6 shadow-md flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <div className="flex gap-4 items-center flex-col sm:flex-row text-center sm:text-left">
          <img src={icons.not_verified} alt="Not Verified" className="w-11" />
          <div>
            <h1 className="font-bold text-xl md:text-2xl text-yellow-900">Account Not Verified</h1>
            <p className="text-yellow-900 text-sm md:text-base">
              Please verify your account and complete your profile to unlock all features.
            </p>
          </div>
        </div>

        <button className="bg-green-600 text-white px-10 py-1 cursor-pointer whitespace-nowrap self-stretch md:self-auto" onClick={openForm}>
          Verify Now
        </button>
      </div>
    </div>
  );
};

export default VerificationStatus;