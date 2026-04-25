import { useState } from 'react';
import PropTypes from 'prop-types';

const initialForm = {
  position_role: '',
  no_of_workers: '',
  work_location: '',
  start_date: '',
  end_date: '',
  contract_duration: '',
  work_schedule: '',
  work_hours: '',
  monthly_rate: '',
  overtime_rate: '',
  payment_schedule: '',
};

export default function FinalAgreementModal({ onClose }) {
  const [form, setForm] = useState(initialForm);

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden bg-white border border-gray-300 shadow-2xl">
        <div className="bg-[#2563EB] px-8 py-5 text-white">
          <div className="text-2xl font-bold">Final Agreement</div>
          <div className="mt-2 inline-flex bg-white px-4 py-1 text-xs text-gray-400">
            Pending Confirmation
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto bg-[#F3F4F6] px-8 py-8 text-sm">
          <div className="text-sm font-semibold tracking-wide text-gray-600">JOB DETAILS</div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Position/Role</label>
              <input
                type="text"
                placeholder="e.g., Plumber, Electrician, Carpenter"
                value={form.position_role}
                onChange={updateField('position_role')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-500">No. of Workers</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g., 8"
                value={form.no_of_workers}
                onChange={updateField('no_of_workers')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-500">Work Location</label>
              <input
                type="text"
                placeholder="e.g., Mabini, Cabadbaran City"
                value={form.work_location}
                onChange={updateField('work_location')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-500">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={updateField('start_date')}
                  className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={updateField('end_date')}
                  className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-500">Contract Duration</label>
              <input
                type="text"
                placeholder="e.g., 6 months"
                value={form.contract_duration}
                onChange={updateField('contract_duration')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-500">Work Schedule</label>
                <input
                  type="text"
                  placeholder="e.g., Mon-Fri"
                  value={form.work_schedule}
                  onChange={updateField('work_schedule')}
                  className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">Work Hours</label>
                <input
                  type="text"
                  placeholder="e.g., 8:00 AM - 5:00 PM"
                  value={form.work_hours}
                  onChange={updateField('work_hours')}
                  className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 text-sm font-semibold tracking-wide text-gray-600">JOB DETAILS</div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Monthly Rate (per worker)</label>
              <input
                type="text"
                placeholder="e.g., P18,000"
                value={form.monthly_rate}
                onChange={updateField('monthly_rate')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-500">Overtime Rate</label>
              <input
                type="text"
                placeholder="e.g., 100.00/hour"
                value={form.overtime_rate}
                onChange={updateField('overtime_rate')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-500">Payment Schedule</label>
              <input
                type="text"
                placeholder="e.g., Monthly (end of the month)"
                value={form.payment_schedule}
                onChange={updateField('payment_schedule')}
                className="w-full border border-gray-400 bg-white px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="min-w-56 bg-[#334155] px-8 py-2.5 text-sm text-white cursor-pointer hover:bg-[#1F2937] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-56 bg-[#2563EB] px-8 py-2.5 text-sm text-white cursor-pointer hover:bg-[#1D4ED8] transition-colors"
            >
              Submit Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

FinalAgreementModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
