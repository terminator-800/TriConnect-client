import icons from "../assets/svg/Icons";

const SubmitSucessful = ({ onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 ml-55">
        <div className="flex flex-col items-center">
          {/* Verification Box */}
          <div className="bg-white shadow-lg px-10 py-15 w-full max-w-5xl text-center flex flex-col items-center relative">

            <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer"
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

            {/* Centered Email Icon */}
            <img
              src={icons.verification_email}
              alt="email icon"
              className="w-20 h-20 mb-6 mx-auto"
            />

            <h1 className="text-[#003479] text-3xl font-semibold mb-2">
              Requirements Successfully Submitted!
            </h1>
            <p className="mb-4">
              Thank you for submitting your verification requirements. Your
              documents are now{" "}
              <span className="font-semibold"> under review</span> by our admin
              team.
            </p>
            <p>
              You will receive an{" "}
              <span className="font-semibold">email notification</span> once the
              review is complete. This process typically takes 1-3 business
              days.
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitSucessful;
