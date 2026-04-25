import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../../../../api/axios.js';
import Pagination from '../../../../components/Pagination';
import Sidebar from '../Sidebar';
import { PENDING_DEPLOYMENTS_QUERY_KEY, usePendingDeployments } from './usePendingDeployments';
import { ThreeDotsHorizontalIcon } from '../../../../assets/icon2/icon2.jsx';

const ITEMS_PER_PAGE = 5;

function formatPhp(n) {
  return `₱${Number(n).toLocaleString('en-PH')}`;
}

function isPdfUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  if (lower.split('?')[0].endsWith('.pdf')) return true;
  if (lower.includes('/raw/upload')) return true;
  if (lower.includes('format=pdf') || lower.includes('application%2Fpdf')) return true;
  return false;
}

function refDisplay(value) {
  if (value == null || String(value).trim() === '') return '—';
  return String(value).trim();
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** e.g. April-10-2026 */
function formatSubmittedDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const month = MONTH_NAMES[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

function paymentMethodLabel(method) {
  if (method === 'gcash') return 'GCash';
  if (method === 'bank_transfer') return 'Bank transfer';
  return method ? String(method).replace(/_/g, ' ') : '—';
}

const MENU_WIDTH_PX = 208; // matches Tailwind w-52

function DeploymentRowMenu({ deployment, onViewDetails, onApprove, approvingId }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const busy = approvingId === deployment.deployment_id;

  const updateMenuPosition = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, rect.right - MENU_WIDTH_PX),
      window.innerWidth - MENU_WIDTH_PX - 8
    );
    setMenuPos({ top: rect.bottom + 4, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const t = e.target;
      if (buttonRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const menu =
    open &&
    createPortal(
      <div
        ref={menuRef}
        className="fixed w-52 bg-white border border-gray-200 shadow-xl py-1 text-sm z-[300]"
        style={{ top: menuPos.top, left: menuPos.left }}
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-2 cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-gray-800"
          onClick={() => {
            setOpen(false);
            onViewDetails(deployment);
          }}
        >
          View details
        </button>
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-2 cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-100"
          disabled={busy}
          onClick={() => {
            setOpen(false);
            onApprove(deployment.deployment_id);
          }}
        >
          {busy ? 'Approving…' : 'Approve'}
        </button>
      </div>,
      document.body
    );

  return (
    <>
      <div className="flex justify-end">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-2 min-w-10 min-h-10 inline-flex items-center justify-center cursor-pointer text-gray-700 hover:bg-[#2563EB]/15 hover:[&_svg]:text-[#2563EB] hover:[&_path]:stroke-[#2563EB]"
          aria-label="Row actions"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <ThreeDotsHorizontalIcon
            size={28}
            className="w-7 h-7 shrink-0 text-gray-700 transition-colors"
          />
        </button>
      </div>
      {menu}
    </>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 py-2 border-b border-gray-100 text-sm">
      <dt className="text-gray-500 font-medium">{label}</dt>
      <dd className="text-gray-900 break-words">{children}</dd>
    </div>
  );
}

const DeploymentVerification = () => {
  const queryClient = useQueryClient();
  const {
    data: deployments = [],
    isPending: loading,
    isError,
    error: queryError,
  } = usePendingDeployments();
  const error =
    isError &&
    (queryError?.response?.data?.error ||
      queryError?.message ||
      'Failed to load deployments.');
  const [approvingId, setApprovingId] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [detailsDeployment, setDetailsDeployment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(deployments.length / ITEMS_PER_PAGE);
  const paginatedDeployments = deployments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (deployments.length === 0) {
      setCurrentPage(1);
      return;
    }
    const tp = Math.ceil(deployments.length / ITEMS_PER_PAGE);
    setCurrentPage((p) => (p > tp ? tp : p));
  }, [deployments.length]);

  const modalOpen = Boolean(receiptModal || detailsDeployment);

  useEffect(() => {
    if (!modalOpen) {
      document.body.style.overflow = 'auto';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (receiptModal) setReceiptModal(null);
        else setDetailsDeployment(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen, receiptModal]);

  const openReceiptModal = (d) => {
    if (!d.proof_file_path) return;
    setReceiptModal({
      url: d.proof_file_path,
      originalName: d.proof_original_name || '',
      paymentReference: d.payment_reference,
      deploymentId: d.deployment_id,
    });
  };

  const handleApprove = async (deploymentId) => {
    setApprovingId(deploymentId);
    try {
      await api.put(`/administrator/approve/deployment/${deploymentId}`, {});
      await queryClient.invalidateQueries({ queryKey: PENDING_DEPLOYMENTS_QUERY_KEY });
      setDetailsDeployment((prev) =>
        prev && prev.deployment_id === deploymentId ? null : prev
      );
    } catch (e) {
      alert(e.response?.data?.error || e.message || 'Approve failed.');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      <Sidebar />

      {detailsDeployment && (
        <div
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetailsDeployment(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border border-gray-300 pt-12 pb-6 px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deployment-details-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailsDeployment(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 id="deployment-details-title" className="text-lg font-bold text-[#2563EB] pr-10 mb-4">
              Deployment details
            </h2>
            <p className="text-sm text-gray-500 mb-4">#{detailsDeployment.deployment_id}</p>

            <dl>
              <DetailRow label="Agency">{detailsDeployment.agency_name || '—'}</DetailRow>
              <DetailRow label="Provider email">{detailsDeployment.provider_email || '—'}</DetailRow>
              <DetailRow label="Project">{detailsDeployment.project_name || '—'}</DetailRow>
              <DetailRow label="Employer">{detailsDeployment.employer_name || '—'}</DetailRow>
              <DetailRow label="Location">{refDisplay(detailsDeployment.location)}</DetailRow>
              <DetailRow label="Workers">{detailsDeployment.member_count ?? '—'}</DetailRow>
              <DetailRow label="Total employer (monthly)">
                {formatPhp(detailsDeployment.total_employer_monthly ?? 0)}
              </DetailRow>
              <DetailRow label="Platform fee">{formatPhp(detailsDeployment.total_platform_fee ?? 0)}</DetailRow>
              <DetailRow label="Payment method">
                {paymentMethodLabel(detailsDeployment.payment_method)}
              </DetailRow>
              <DetailRow label="Payment reference">{refDisplay(detailsDeployment.payment_reference)}</DetailRow>
              <DetailRow label="Proof file name">
                {detailsDeployment.proof_original_name || '—'}
              </DetailRow>
              <DetailRow label="Submitted">
                {detailsDeployment.created_at ? formatSubmittedDate(detailsDeployment.created_at) : '—'}
              </DetailRow>
            </dl>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              {detailsDeployment.proof_file_path ? (
                <button
                  type="button"
                  onClick={() => openReceiptModal(detailsDeployment)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1d4ed8] cursor-pointer"
                >
                  View payment receipt
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => handleApprove(detailsDeployment.deployment_id)}
                disabled={approvingId === detailsDeployment.deployment_id}
                className={`px-4 py-2 text-sm font-medium text-white ${
                  approvingId === detailsDeployment.deployment_id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-[#1d4ed8] cursor-pointer'
                }`}
              >
                {approvingId === detailsDeployment.deployment_id ? 'Approving…' : 'Approve deployment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setReceiptModal(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border border-gray-300 pt-12 pb-6 px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setReceiptModal(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 id="receipt-modal-title" className="text-lg font-bold text-[#2563EB] pr-10 mb-1">
              Payment receipt
            </h2>
            <p className="text-sm text-gray-500 mb-4">Deployment #{receiptModal.deploymentId}</p>

            <div className="mb-4 border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div>
                  <span className="text-gray-500">Payment reference</span>
                  <span className="ml-2 font-medium text-gray-900">{refDisplay(receiptModal.paymentReference)}</span>
                </div>
                {receiptModal.originalName ? (
                  <div className="text-gray-600 break-all">
                    <span className="text-gray-500">File: </span>
                    {receiptModal.originalName}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border border-gray-200 bg-gray-100 flex justify-center min-h-[200px] max-h-[min(70vh,600px)] overflow-auto">
              {isPdfUrl(receiptModal.url) ? (
                <iframe
                  title="Payment receipt"
                  src={receiptModal.url}
                  className="w-full min-h-[min(70vh,600px)] bg-white"
                />
              ) : (
                <img
                  src={receiptModal.url}
                  alt="Payment receipt"
                  className="max-w-full h-auto object-contain"
                />
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <a
                href={receiptModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#2563EB] underline hover:text-[#1d4ed8]"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#2563EB]">Deployment Verification</h1>
            <p>Review manpower deployment payments and approve to move workers to Deploy status.</p>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <p className="mt-10 text-lg text-gray-600">Loading pending deployments…</p>
          ) : error ? (
            <p className="mt-10 text-red-500">{error}</p>
          ) : deployments.length === 0 ? (
            <p className="mt-10 text-lg text-gray-500 italic text-center">
              No deployments pending verification.
            </p>
          ) : (
            <div className="mt-10 flex-1 overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-[#374151]">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">ID</th>
                    <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">Agency</th>
                    <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">Project</th>
                    <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">Employer</th>
                    <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">Submitted</th>
                    <th className="px-6 py-3 text-left font-semibold w-14">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedDeployments.map((d) => (
                    <tr key={d.deployment_id}>
                      <td className="px-6 py-4 text-sm font-mono text-gray-800">{d.deployment_id}</td>
                      <td className="px-6 py-4 text-sm font-bold italic text-gray-800 max-w-[200px]">
                        {d.agency_name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-[220px]">{d.project_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-[200px]">{d.employer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <span className="text-gray-500 text-sm">
                          {d.created_at ? formatSubmittedDate(d.created_at) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 align-middle">
                        <DeploymentRowMenu
                          deployment={d}
                          onViewDetails={setDetailsDeployment}
                          onApprove={handleApprove}
                          approvingId={approvingId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {deployments.length > 0 ? (
          <div className="mt-10 mb-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DeploymentVerification;
