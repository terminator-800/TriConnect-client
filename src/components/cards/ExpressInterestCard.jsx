import icons from '../../assets/svg/Icons';

export const ExpressInterestCard = (msg, isSender) => {
  const {
    express_message,
    sender_name,
  } = msg;

  // Check if express_message is empty
  if (!express_message || !express_message.trim()) {
    return (
      <div className="w-full max-w-lg px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
        <p className="text-red-700 text-sm font-semibold">⚠️ Incomplete Message</p>
        <p className="text-red-600 text-xs mt-1">Express message is missing.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
      {/* Content */}
      <div className="px-2 py-5 space-y-4">
        {/* Express Message */}
        <div>
          <div className="py-6 rounded bg-gray-50">
            <p className="text-gray-900 wrap-break-word whitespace-pre-wrap">
              {express_message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};