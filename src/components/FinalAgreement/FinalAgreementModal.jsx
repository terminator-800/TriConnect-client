import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

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

function toNumber(raw) {
  const digits = String(raw ?? '')
    .replace(/[^\d.]/g, '')
    .trim();
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export default function FinalAgreementModal({ onClose, role, selectedUser }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const queryClient = useQueryClient();

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser?.conversation_id || !selectedUser?.sender_id) return;
    if (!agreeChecked) return;

    const workers = toNumber(form.no_of_workers);
    const monthlyRate = toNumber(form.monthly_rate);
    const contractDuration = form.contract_duration;
    const durationMonths = toNumber(contractDuration);
    const totalContractValue = workers * monthlyRate * Math.max(1, durationMonths || 1);

    const agreement = {
      ...form,
      monthly_rate: monthlyRate,
      no_of_workers: workers,
      total_contract_value: totalContractValue,
      agreed_to_terms: true,
    };

    setIsSubmitting(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/${role}/final-agreement`,
        {
          conversation_id: selectedUser.conversation_id,
          receiver_id: selectedUser.sender_id,
          agreement,
        },
        { withCredentials: true }
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages', role, selectedUser.conversation_id] });
        queryClient.invalidateQueries({ queryKey: ['conversations', role] });
        onClose();
      })
      .catch((error) => {
        const apiError = error?.response?.data?.error;
        if (apiError) alert(apiError);
      })
      .finally(() => setIsSubmitting(false));
  };

  const workers = toNumber(form.no_of_workers);
  const monthlyRate = toNumber(form.monthly_rate);
  const durationMonths = toNumber(form.contract_duration);
  const totalContractValue = workers * monthlyRate * Math.max(1, durationMonths || 1);

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

          <div className="mt-6 rounded bg-[#D9D9D9] p-6 text-sm">
            <div className="flex items-center justify-between py-1">
              <span>Monthly Rate</span>
              <span className="font-semibold">₱{monthlyRate.toLocaleString('en-PH')}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Workers</span>
              <span className="font-semibold">{workers}</span>
            </div>
            <div className="mt-2 border-t border-white/70 pt-3 flex items-center justify-between">
              <span>Total Contract Value</span>
              <span className="font-semibold text-[#2563EB]">
                ₱{totalContractValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreeChecked}
              onChange={(e) => setAgreeChecked(e.target.checked)}
              className="mt-1 cursor-pointer"
            />
            <span>
              By confirming, you agree to the terms above and authorize TriConnect to collect a
              <span className="text-[#2563EB]"> 10% platform fee </span>
              for each worker deployed.
            </span>
          </label>

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
              disabled={isSubmitting || !agreeChecked}
              className="min-w-56 bg-[#2563EB] px-8 py-2.5 text-sm text-white cursor-pointer hover:bg-[#1D4ED8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

FinalAgreementModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  selectedUser: PropTypes.object,
};
