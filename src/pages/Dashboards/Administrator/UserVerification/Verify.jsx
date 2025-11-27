import { useVerifyUser } from '../../../../../hooks/useVerifyUser';
import { ROLE_LABELS } from '../../../../../utils/role';
import { useEffect } from 'react';

const Verify = ({ onClose, user }) => {
  if (!user) return null;

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const { mutate: verify, isPending } = useVerifyUser();

  const handleVerify = () => {
    verify(user.user_id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ml-55">
      <div className=" p-8 shadow-lg max-w-3xl w-full relative backdrop-blur-2xl">
        
        {/* Confirmation Message */}
        <h2 className="text-xl font-bold mb-4 text-center text-blue-900">
          Confirm Verification
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to verify this user? This action cannot be undone.
        </p>

        {/* User Details */}
        <div className="mb-4 text-sm text-gray-800 border border-gray-300 p-4">
          <p>
            <strong>Full Name:</strong>{' '}
            {user.full_name || user.business_name || user.agency_name || 'N/A'}
          </p>
          <p>
            <strong>Email:</strong> {user.email || 'N/A'}
          </p>
          <p>
            <strong>Role:</strong> {ROLE_LABELS[user.role] || user.role}
          </p>
        </div>

          {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleVerify}
            disabled={isPending}
            className={`
              px-10 py-1 text-white 
              ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-700 cursor-pointer'}
            `}
          >
            {isPending ? 'Verifying...' : 'Verify'} 
          </button>

          <button
            onClick={onClose}
            disabled={isPending}
            className={`px-10 py-1 text-black ${
              isPending
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gray-300 hover:bg-gray-400 cursor-pointer' 
            }`}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default Verify;
