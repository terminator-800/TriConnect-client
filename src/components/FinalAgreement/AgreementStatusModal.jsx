const AgreementStatusModal = ({ isOpen, title, message, titleClass = 'text-[#22C55E]', onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
      <div className="w-full max-w-xl bg-[#D1D5DB] border border-gray-300 shadow-xl relative p-10 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#DC2626] text-white text-xl leading-none flex items-center justify-center cursor-pointer hover:bg-[#B91C1C]"
        >
          ×
        </button>
        <h2 className={`text-3xl font-bold mb-4 ${titleClass}`}>{title}</h2>
        <p className="text-base text-[#667085] leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default AgreementStatusModal;
