import icons from '../assets/svg/Icons';
import { useLocation } from 'react-router-dom';
import Navbar from '../pages/Navbar';

function VerifyAccount() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <>
      <Navbar userType={'verify'} />
      <div className="flex justify-center items-center h-screen bg-linear-to-b from-white to-[#00C2CB]">
        <div className="flex flex-col items-center shadow-lg">
          {/* Verification Box */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center flex flex-col items-center">
            {/* Centered Email Icon */}
            <img
              src={icons.verification_email}
              alt="email icon"
              className="w-16 h-16 mb-6 mx-auto"
            />

            <p className="text-gray-800 font-semibold mb-2">We’ve sent a verification email to:</p>
            <p className="text-blue-600 font-medium mb-4 underline">
              {email || 'No email provided'}
            </p>
            <p className="text-gray-600 text-sm">
              Please check your email and click the verification link to verify your account.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyAccount;
