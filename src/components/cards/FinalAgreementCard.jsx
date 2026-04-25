const decisionLabelMap = {
  accepted: 'Confirmed',
  declined: 'Declined',
};

export const FinalAgreementCard = ({
  agreement,
  decisionStatus = null,
  showActions = false,
  isSubmitting = false,
  onConfirm,
  onDecline,
}) => {
  if (!agreement) return null;

  const money = (n) =>
    `₱${Number(n || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-sm overflow-hidden">
      <div className="bg-[#2563EB] px-6 py-3 text-white text-2xl font-bold">Final Agreement</div>
      <div className="p-6 bg-[#F3F4F6] text-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Position/Role</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.position_role || '—'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">No. of Workers</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.no_of_workers || '—'}</div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Worker Location</label>
          <div className="border border-gray-300 bg-white px-3 py-2">{agreement.work_location || '—'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Start Date</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.start_date || '—'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">End Date</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.end_date || '—'}</div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Contract Duration</label>
          <div className="border border-gray-300 bg-white px-3 py-2">{agreement.contract_duration || '—'}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Work Schedule</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.work_schedule || '—'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Work Hours</label>
            <div className="border border-gray-300 bg-white px-3 py-2">{agreement.work_hours || '—'}</div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Payment Schedule</label>
          <div className="border border-gray-300 bg-white px-3 py-2">{agreement.payment_schedule || '—'}</div>
        </div>

        <div className="rounded bg-[#D9D9D9] p-4 text-sm">
          <div className="flex justify-between py-1">
            <span>Monthly Rate</span>
            <span className="font-semibold">{money(agreement.monthly_rate)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Workers</span>
            <span className="font-semibold">{agreement.no_of_workers || 0}</span>
          </div>
          <div className="mt-2 border-t border-white/70 pt-3 flex justify-between">
            <span>Total Contract Value</span>
            <span className="font-semibold text-[#2563EB]">{money(agreement.total_contract_value)}</span>
          </div>
        </div>

        {decisionStatus && (
          <div className="border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
            Agreement Status:{' '}
            <span className="font-semibold text-[#2563EB]">
              {decisionLabelMap[decisionStatus] || decisionStatus}
            </span>
          </div>
        )}

        {showActions && !decisionStatus && (
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onDecline}
              disabled={isSubmitting}
              className="border border-red-500 bg-white text-red-500 px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Decline Agreement'}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="border border-[#2563EB] bg-white text-[#2563EB] px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Agreement'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const FinalAgreementResponseCard = ({ decision }) => {
  const label = decisionLabelMap[decision] || 'Updated';
  const isAccepted = decision === 'accepted';

  return (
    <div
      className={`border px-4 py-3 text-sm font-medium ${
        isAccepted
          ? 'border-green-600 bg-green-50 text-green-700'
          : 'border-red-500 bg-red-50 text-red-600'
      }`}
    >
      {`Final agreement ${label.toLowerCase()} by agency.`}
    </div>
  );
};
