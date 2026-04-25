import { useMemo, useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import Sidebar from '../Sidebar';
import { ROLE } from '../../../../../utils/role';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import VerificationStatus from '../VerificationForm/VerificationStatus';
import Form from '../VerificationForm/Form';
import { useTeamMembers } from './useTeamMembers';
import { useAddTeamMember } from './useAddTeamMember';
import { useSubmitDeployment } from './useSubmitDeployment';
import { ThreeDotsHorizontalIcon } from '../../../../assets/icon2/icon2.jsx';

const statusLabel = (s) => {
  if (s === 'deploy') return 'Deployed';
  if (s === 'pending') return 'Pending';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Tailwind classes: bg + text + border for the status pill */
const statusBadgeClass = (s) => {
  switch (s) {
    case 'available':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    case 'pending':
      return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'deploy':
      return 'bg-[#2563EB]/12 text-[#1e3a8a] border-[#2563EB]/35';
    case 'completed':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

function parseMonthlyRate(raw) {
  if (raw == null || raw === '') return null;
  const s = String(raw);
  const digits = s.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? null : n;
}

function formatPhp(amount) {
  return `₱${Number(amount).toLocaleString('en-PH')}`;
}

function mapTeamMemberRow(row) {
  return {
    id: String(row.team_member_id),
    name: row.full_name,
    jobTitle: row.job_title ?? '—',
    email: row.email ?? '—',
    location: row.location ?? '—',
    yearsExperience: row.years_experience,
    status: row.status,
  };
}

const TEAM_MENU_WIDTH_PX = 192; // Tailwind w-48

function TeamRowMenu({ member, onRemove, onDeploy, onViewProfile }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, rect.right - TEAM_MENU_WIDTH_PX),
      window.innerWidth - TEAM_MENU_WIDTH_PX - 8
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
        className="fixed w-48 bg-white border border-gray-200 shadow-xl z-[300] py-1 text-sm"
        style={{ top: menuPos.top, left: menuPos.left }}
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-2 cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-gray-700"
          onClick={() => {
            setOpen(false);
            onViewProfile(member);
          }}
        >
          View workers
        </button>
        {member.status === 'available' && (
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-3 py-2 cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-gray-700 border-t border-gray-100"
            onClick={() => {
              setOpen(false);
              onDeploy(member);
            }}
          >
            Deploy member
          </button>
        )}
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-2 cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-gray-700 border-t border-gray-100 border-b border-[#D8D9DB]"
          onClick={() => setOpen(false)}
        >
          Edit details
        </button>
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-2 cursor-pointer text-red-600 hover:bg-red-50 border-t border-gray-100"
          onClick={() => {
            onRemove(member.id);
            setOpen(false);
          }}
        >
          Remove member
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

const ManageTeams = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [statusTab, setStatusTab] = useState('available');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProfileMember, setViewProfileMember] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployAnchorMember, setDeployAnchorMember] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentLines, setPaymentLines] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [showPickMemberModal, setShowPickMemberModal] = useState(false);
  const [pickMemberId, setPickMemberId] = useState('');
  /** Snapshot so Payment step 1 “Back” reopens deploy form instead of closing the flow */
  const [pendingDeployRestore, setPendingDeployRestore] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptRefNumber, setReceiptRefNumber] = useState('');
  const receiptFileInputRef = useRef(null);
  const [showPaymentSubmittedModal, setShowPaymentSubmittedModal] = useState(false);
  const [paymentSubmittedSummary, setPaymentSubmittedSummary] = useState(null);
  const [deployDraft, setDeployDraft] = useState({
    projectName: '',
    employerName: '',
    location: '',
    startDate: '',
    endDate: '',
    siteContact: '',
    monthlyRate: '',
  });
  const [addDraft, setAddDraft] = useState({
    name: '',
    jobTitle: '',
    email: '',
    location: '',
    yearsExperience: '',
  });

  const resetReceiptFields = useCallback(() => {
    setReceiptFile(null);
    setReceiptRefNumber('');
    if (receiptFileInputRef.current) receiptFileInputRef.current.value = '';
  }, []);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    setPaymentStep(1);
    setPaymentLines([]);
    setPendingDeployRestore(null);
    resetReceiptFields();
    document.body.style.overflow = 'auto';
  }, [resetReceiptFields]);

  const {
    data: provider,
    isLoading: isProviderLoading,
    isError,
    refetch,
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);

  const {
    data: teamMemberRows = [],
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useTeamMembers(provider?.is_verified);

  const { mutateAsync: addTeamMember, isPending: isAddingMember } = useAddTeamMember();
  const deploySubmit = useSubmitDeployment();

  const members = useMemo(
    () => (Array.isArray(teamMemberRows) ? teamMemberRows : []).map(mapTeamMemberRow),
    [teamMemberRows]
  );

  const filtered = useMemo(
    () => members.filter((m) => m.status === statusTab),
    [members, statusTab]
  );

  useEffect(() => {
    if (!viewProfileMember) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setViewProfileMember(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', onKey);
    };
  }, [viewProfileMember]);

  const handleRemoveMember = (id) => {
    setViewProfileMember((prev) =>
      prev && String(prev.id) === String(id) ? null : prev
    );
    queryClient.setQueryData(['manpowerTeamMembers'], (old) => {
      if (!old || !Array.isArray(old)) return old;
      return old.filter((row) => String(row.team_member_id) !== String(id));
    });
  };

  const openDeployModal = (member) => {
    const safe = (v) => (v && v !== '—' ? v : '');
    setPendingDeployRestore(null);
    setDeployAnchorMember(member);
    setDeployDraft({
      projectName: safe(member.jobTitle),
      employerName: safe(member.name),
      location: safe(member.location),
      startDate: '',
      endDate: '',
      siteContact: '',
      monthlyRate: '',
    });
    document.body.style.overflow = 'hidden';
    setShowDeployModal(true);
  };

  const closeDeployModal = () => {
    setShowDeployModal(false);
    setDeployAnchorMember(null);
    setPendingDeployRestore(null);
    setPaymentLines([]);
    setPaymentStep(1);
    resetReceiptFields();
    document.body.style.overflow = 'auto';
  };

  const handleDeploySubmit = (e) => {
    e.preventDefault();
    if (!deployAnchorMember) return;
    const workerRate = parseMonthlyRate(deployDraft.monthlyRate) || 18000;
    setPendingDeployRestore({
      anchorMember: deployAnchorMember,
      draft: { ...deployDraft },
    });
    setPaymentLines([{ member: deployAnchorMember, workerRate }]);
    setPaymentMethod('gcash');
    setPaymentStep(1);
    setShowDeployModal(false);
    setDeployAnchorMember(null);
    setShowPaymentModal(true);
  };

  const handleBackFromPaymentStep1 = () => {
    if (!pendingDeployRestore) {
      closePaymentModal();
      return;
    }
    resetReceiptFields();
    setDeployAnchorMember(pendingDeployRestore.anchorMember);
    setDeployDraft(pendingDeployRestore.draft);
    setShowPaymentModal(false);
    setPaymentStep(1);
    setPaymentLines([]);
    setShowDeployModal(true);
    document.body.style.overflow = 'hidden';
  };

  const validateReceiptFile = (file) => {
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('File must be 5MB or smaller.');
      return false;
    }
    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    const okMime = allowedMime.includes(file.type);
    const okExt = /\.(jpe?g|png|pdf)$/i.test(file.name);
    if (!okMime && !okExt) {
      alert('Accepted formats: JPG, PNG, PDF.');
      return false;
    }
    return true;
  };

  const handleReceiptFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!validateReceiptFile(file)) {
      e.target.value = '';
      setReceiptFile(null);
      return;
    }
    setReceiptFile(file);
  };

  const handleReceiptDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!validateReceiptFile(file)) return;
    setReceiptFile(file);
    if (receiptFileInputRef.current) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        receiptFileInputRef.current.files = dt.files;
      } catch {
        /* ignore if browser blocks */
      }
    }
  };

  const openReceiptFilePicker = () => {
    const el = receiptFileInputRef.current;
    if (!el) return;
    el.value = '';
    el.click();
  };

  const closePaymentSubmittedModal = useCallback(() => {
    setShowPaymentSubmittedModal(false);
    setPaymentSubmittedSummary(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handleReceiptSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      alert('Please upload a screenshot or receipt.');
      return;
    }
    const platformPct = 0.1;
    const totalPlatform = paymentLines.reduce(
      (sum, line) => sum + Math.round(line.workerRate * platformPct),
      0
    );
    const workersLabel = paymentLines.map((line) => line.member.name).join(', ');
    const employerLabel =
      deployDraft.employerName?.trim() ||
      pendingDeployRestore?.draft?.employerName?.trim() ||
      '—';
    const methodLabel = paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer';
    const refDisplay = receiptRefNumber.trim() || '—';

    const payload = {
      project_name: deployDraft.projectName?.trim() || '',
      employer_name: deployDraft.employerName?.trim() || '',
      location: deployDraft.location?.trim() || '',
      start_date: deployDraft.startDate?.trim() || null,
      end_date: deployDraft.endDate?.trim() || null,
      site_contact: deployDraft.siteContact?.trim() || null,
      payment_method: paymentMethod === 'gcash' ? 'gcash' : 'bank_transfer',
      payment_reference: receiptRefNumber.trim() || null,
      members: paymentLines.map((line) => ({
        team_member_id: Number(line.member.id),
        worker_rate: line.workerRate,
      })),
    };

    try {
      await deploySubmit.mutateAsync({ payload, receiptFile });
      setPaymentSubmittedSummary({
        workersLabel,
        employerLabel,
        paymentMethodLabel: methodLabel,
        amountLabel: `${formatPhp(totalPlatform)}.00`,
        refDisplay,
      });
      closePaymentModal();
      setShowPaymentSubmittedModal(true);
      document.body.style.overflow = 'hidden';
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to submit deployment.';
      alert(msg);
    }
  };

  const receiptPreviewUrl = useMemo(
    () => (receiptFile ? URL.createObjectURL(receiptFile) : null),
    [receiptFile]
  );

  useEffect(() => {
    return () => {
      if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl);
    };
  }, [receiptPreviewUrl]);

  const receiptIsPdf = useMemo(() => {
    if (!receiptFile) return false;
    return receiptFile.type === 'application/pdf' || /\.pdf$/i.test(receiptFile.name);
  }, [receiptFile]);

  const paymentTotals = useMemo(() => {
    const platformPct = 0.1;
    const lines = paymentLines.map((line) => ({
      ...line,
      platformFee: Math.round(line.workerRate * platformPct),
    }));
    const totalEmployer = lines.reduce((s, l) => s + l.workerRate, 0);
    const totalPlatform = lines.reduce((s, l) => s + l.platformFee, 0);
    return { lines, totalEmployer, totalPlatform, workerCount: lines.length };
  }, [paymentLines]);

  const availableMembersToAdd = useMemo(() => {
    const inBatch = new Set(paymentLines.map((l) => l.member.id));
    return members.filter((m) => m.status === 'available' && !inBatch.has(m.id));
  }, [members, paymentLines]);

  const handleAddMemberToPayment = () => {
    if (!pickMemberId) return;
    const member = members.find((m) => m.id === pickMemberId);
    if (!member) return;
    const rate = paymentLines[0]?.workerRate ?? 18000;
    setPaymentLines((prev) => [...prev, { member, workerRate: rate }]);
    setPickMemberId('');
    setShowPickMemberModal(false);
  };

  const handleRemoveLineFromPayment = (memberId) => {
    setPaymentLines((prev) => prev.filter((l) => l.member.id !== memberId));
  };

  useEffect(() => {
    if (showPaymentModal && paymentLines.length === 0) {
      setShowPaymentModal(false);
      setPaymentStep(1);
      setPendingDeployRestore(null);
      resetReceiptFields();
      document.body.style.overflow = 'auto';
    }
  }, [showPaymentModal, paymentLines.length, resetReceiptFields]);

  useEffect(() => {
    if (!showDeployModal && !showPaymentModal && !showPickMemberModal && !showPaymentSubmittedModal)
      return;
    const onEscape = (e) => {
      if (e.key !== 'Escape') return;
      if (showPaymentSubmittedModal) {
        closePaymentSubmittedModal();
        return;
      }
      if (showPickMemberModal) {
        setShowPickMemberModal(false);
        setPickMemberId('');
        return;
      }
      if (showDeployModal) {
        setShowDeployModal(false);
        setDeployAnchorMember(null);
        document.body.style.overflow = 'auto';
        return;
      }
      if (showPaymentModal) {
        closePaymentModal();
      }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [
    showDeployModal,
    showPaymentModal,
    showPickMemberModal,
    showPaymentSubmittedModal,
    closePaymentModal,
    closePaymentSubmittedModal,
  ]);

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const y = parseInt(addDraft.yearsExperience, 10);
    if (!addDraft.name.trim() || Number.isNaN(y)) return;
    try {
      await addTeamMember({
        full_name: addDraft.name.trim(),
        job_title: addDraft.jobTitle.trim(),
        email: addDraft.email.trim(),
        location: addDraft.location.trim(),
        years_experience: y,
      });
      setAddDraft({
        name: '',
        jobTitle: '',
        email: '',
        location: '',
        yearsExperience: '',
      });
      setShowAddModal(false);
    } catch {
      // useAddTeamMember already alerts on error
    }
  };

  if (isProviderLoading) return <div className="p-10">Loading...</div>;
  if (isError || !provider) return <div className="p-10 text-red-600">Error!</div>;

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        {provider.is_verified && isTeamLoading ? (
          <div className="p-10">Loading team...</div>
        ) : provider.is_verified ? (
          <>
            {isTeamError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                Could not load team members. Refresh the page or try again later.
              </div>
            )}
            <div className="bg-white shadow-md py-6 px-10 mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-[#2563EB]">Team Management</h1>
                  <p>Add and manage your team members</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="text-[#2563EB] border border-[#2563EB] font-semibold px-6 py-2 bg-white hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    + Add Member
                  </button>
                  {(['available', 'pending', 'deploy', 'completed']).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusTab(key)}
                      className={`px-6 py-2 font-medium transition-colors cursor-pointer ${
                        statusTab === key
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-[#2563EB]/12 hover:text-[#2563EB]'
                      }`}
                    >
                      {statusLabel(key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="shadow-lg border border-gray-300 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-300 text-[#374151]">
                        <th className="text-left py-3 px-4 font-semibold">Member Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Job Title</th>
                        <th className="text-left py-3 px-4 font-semibold">Email Address</th>
                        <th className="text-left py-3 px-4 font-semibold">Location</th>
                        <th className="text-left py-3 px-4 font-semibold">Years of Experience</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold whitespace-nowrap w-14">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-6 text-center text-gray-500 italic px-4"
                          >
                            No team members in this list.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((m) => (
                          <tr key={m.id} className="border-b border-gray-300 relative">
                            <td className="py-3 px-4 text-gray-900 font-medium">{m.name}</td>
                            <td className="py-3 px-4 text-gray-700">{m.jobTitle}</td>
                            <td className="py-3 px-4 text-gray-700 break-all max-w-[200px]">
                              {m.email}
                            </td>
                            <td className="py-3 px-4 text-gray-700">{m.location}</td>
                            <td className="py-3 px-4 text-gray-700">{m.yearsExperience}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center rounded-md border px-3 py-0.5 text-xs font-medium ${statusBadgeClass(m.status)}`}
                              >
                                {statusLabel(m.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4 align-middle">
                              <TeamRowMenu
                                member={m}
                                onRemove={handleRemoveMember}
                                onDeploy={openDeployModal}
                                onViewProfile={setViewProfileMember}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
            <VerificationStatus profileData={provider} openForm={openForm} />
          </div>
        )}
      </div>

      {showForm && (
        <Form
          onClose={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
          }}
          onSubmitSuccess={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
            refetch();
          }}
        />
      )}

      {showDeployModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={closeDeployModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl bg-white/95 shadow-xl p-6 pt-12"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deploy-member-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDeployModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
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
            <h2 id="deploy-member-title" className="text-lg font-bold text-[#2563EB] mb-6 pr-10">
              Deploy member
            </h2>
            <form onSubmit={handleDeploySubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800">
                  Project Name <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                  placeholder="Graphics Designer"
                  value={deployDraft.projectName}
                  onChange={(e) =>
                    setDeployDraft((d) => ({ ...d, projectName: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800">
                  Employer Name <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                  placeholder="Lanilyn Mongado"
                  value={deployDraft.employerName}
                  onChange={(e) =>
                    setDeployDraft((d) => ({ ...d, employerName: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800">
                  Location <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                  placeholder="Mabini, Cabadbaran City"
                  value={deployDraft.location}
                  onChange={(e) =>
                    setDeployDraft((d) => ({ ...d, location: e.target.value }))
                  }
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-800">
                    Start Date <span className="text-red-600">*</span>
                  </span>
                  <input
                    required
                    type="date"
                    className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                    value={deployDraft.startDate}
                    onChange={(e) =>
                      setDeployDraft((d) => ({ ...d, startDate: e.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-800">
                    End Date <span className="text-red-600">*</span>
                  </span>
                  <input
                    required
                    type="date"
                    className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                    value={deployDraft.endDate}
                    onChange={(e) =>
                      setDeployDraft((d) => ({ ...d, endDate: e.target.value }))
                    }
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800">
                  Site Contact <span className="text-red-600">*</span>
                </span>
                <input
                  required
                  type="tel"
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                  placeholder="09386394107"
                  value={deployDraft.siteContact}
                  onChange={(e) =>
                    setDeployDraft((d) => ({ ...d, siteContact: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800">
                  Monthly rate (per worker)
                </span>
                <input
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-gray-800"
                  placeholder="P18,000"
                  value={deployDraft.monthlyRate}
                  onChange={(e) =>
                    setDeployDraft((d) => ({ ...d, monthlyRate: e.target.value }))
                  }
                />
              </label>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeDeployModal}
                  className="px-8 py-2 bg-[#1e3a5f] text-white font-medium hover:bg-[#152a45] cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#2563EB] text-white font-medium hover:bg-[#1d4ed8] cursor-pointer text-sm"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black/40 p-4"
          onClick={closePaymentModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-200/90 shadow-xl p-6 pt-12"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-summary-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePaymentModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition z-10"
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
            <h2 id="payment-summary-title" className="text-lg font-bold text-[#2563EB] mb-1 pr-10">
              Payment summary
            </h2>
            <p className="text-sm text-gray-600 mb-4 pr-10">
              {paymentStep === 1
                ? 'Step 1 of 3 — Select members for this deployment'
                : paymentStep === 2
                  ? 'Step 2 of 3 — Review totals and payment details'
                  : 'Step 3 of 3 — Upload your receipt'}
            </p>

            {paymentStep === 1 && (
              <>
                <div className="flex flex-col gap-3 mb-4">
                  {paymentTotals.lines.map((line) => (
                    <div
                      key={line.member.id}
                      className="bg-white border border-gray-300 p-4 text-sm"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="font-semibold text-gray-900">{line.member.name}</div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineFromPayment(line.member.id)}
                          className="text-red-600 text-sm font-medium hover:underline shrink-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Worker Rate</span>
                        <span>{formatPhp(line.workerRate)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-600">Platform Fee (10%)</span>
                        <span className="text-red-600 font-medium">
                          {formatPhp(line.platformFee)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {availableMembersToAdd.length > 0 && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setPickMemberId('');
                        setShowPickMemberModal(true);
                      }}
                      className="w-full border border-[#2563EB] text-[#2563EB] font-medium py-2 px-3 text-sm hover:bg-[#2563EB]/10 cursor-pointer bg-white"
                    >
                      + Deploy / add another member
                    </button>
                    <p className="text-xs text-gray-600 mt-1">
                      Choose from members with status Available (not already in this deployment).
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4 flex-wrap pt-2 border-t border-gray-300/80">
                  <button
                    type="button"
                    onClick={handleBackFromPaymentStep1}
                    className="px-8 py-2 bg-[#1e3a5f] text-white font-medium hover:bg-[#152a45] cursor-pointer text-sm min-w-[120px]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={paymentLines.length === 0}
                    onClick={() => setPaymentStep(2)}
                    className={`px-8 py-2 font-medium text-sm min-w-[120px] ${
                      paymentLines.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] cursor-pointer'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {paymentStep === 2 && (
              <>
                <p className="text-sm text-gray-800 mb-4">
                  You are deploying{' '}
                  <span className="font-semibold">{paymentTotals.workerCount}</span> worker
                  {paymentTotals.workerCount !== 1 ? 's' : ''} in this batch.
                </p>

                <div className="bg-[#c4a574]/35 border border-amber-800/30 p-4 mb-6 text-sm">
                  <div className="flex justify-between text-gray-900 font-medium mb-2">
                    <span>Total Employer Pays (monthly)</span>
                    <span>{formatPhp(paymentTotals.totalEmployer)}</span>
                  </div>
                  <div className="border-t border-amber-900/20 my-3" />
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-red-600 font-bold text-lg">
                        Your total due to platform now
                      </span>
                      <span className="text-red-600 font-bold text-xl">
                        {formatPhp(paymentTotals.totalPlatform)}.00
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-red-600">
                      <span>covers {paymentTotals.workerCount} worker(s)</span>
                      <span>Due before deployment</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-500 tracking-wide mb-2">PAYMENT METHOD</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`flex-1 min-w-[120px] border p-3 text-left text-sm cursor-pointer ${
                      paymentMethod === 'gcash'
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-gray-300 bg-white hover:bg-[#2563EB]/10 hover:border-[#2563EB]/40'
                    }`}
                  >
                    <span className="font-semibold text-[#007DFE]">GCash</span>
                    <span className="block text-xs text-gray-500 mt-0.5">e-wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 min-w-[120px] border p-3 text-left text-sm cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : 'border-gray-300 bg-white hover:bg-[#2563EB]/10 hover:border-[#2563EB]/40'
                    }`}
                  >
                    <span className="font-semibold text-gray-800">Bank Transfer</span>
                    <span className="block text-xs text-gray-500 mt-0.5">online banking</span>
                  </button>
                </div>

                <p className="text-xs font-semibold text-gray-500 tracking-wide mb-2">SEND PAYMENT TO</p>
                <div className="bg-white border border-gray-300 p-4 text-sm mb-6">
                  {paymentMethod === 'gcash' ? (
                    <>
                      <div className="text-gray-600 mb-1">Method: GCash</div>
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <span className="text-gray-900 font-medium">0938 639 4107</span>
                        <button
                          type="button"
                          className="text-[#2563EB] text-sm underline cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText('09386394107').catch(() => {});
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-600 mb-1">Method: Bank transfer</div>
                      <div className="text-gray-900">
                        <div>TriConnect Holdings Inc.</div>
                        <div className="mt-1">Acct. No.: 0000-0000-0000</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Use your agency name as reference.
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-center gap-4 flex-wrap pt-2 border-t border-gray-300/80">
                  <button
                    type="button"
                    onClick={() => setPaymentStep(1)}
                    className="px-8 py-2 bg-[#1e3a5f] text-white font-medium hover:bg-[#152a45] cursor-pointer text-sm min-w-[120px]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStep(3)}
                    className="px-8 py-2 bg-[#2563EB] text-white font-medium hover:bg-[#1d4ed8] cursor-pointer text-sm min-w-[120px]"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {paymentStep === 3 && (
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                <div className="border border-[#2563EB]/60 bg-sky-50/90 px-4 py-3 text-sm text-gray-800">
                  {paymentMethod === 'gcash' ? (
                    <>
                      Please pay {formatPhp(paymentTotals.totalPlatform)}.00 via GCash to{' '}
                      <span className="font-semibold">0938 639 4107</span> (TriConnect Platform), then
                      upload your screenshot or receipt below.
                    </>
                  ) : (
                    <>
                      Please pay {formatPhp(paymentTotals.totalPlatform)}.00 via bank transfer to
                      TriConnect Holdings Inc. (Acct. No. 0000-0000-0000), then upload your transfer
                      confirmation or receipt below.
                    </>
                  )}
                </div>

                <div>
                  <input
                    id="receipt-upload-input"
                    ref={receiptFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                    className="sr-only"
                    onChange={handleReceiptFileChange}
                  />
                  {!receiptFile ? (
                    <label
                      htmlFor="receipt-upload-input"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={handleReceiptDrop}
                      className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#2563EB] bg-white/60 px-4 py-12 text-center hover:bg-[#2563EB]/10 hover:[&_svg]:text-[#2563EB] hover:[&_path]:stroke-[#2563EB] transition"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span className="text-[#2563EB] font-semibold text-sm">
                        Upload screenshot or receipt
                      </span>
                      <p className="text-xs text-gray-500 mt-2 max-w-md">
                        Take a screenshot of your GCash / bank confirmation and upload it here.
                        Accepted: JPG, PNG, PDF · Max 5MB
                      </p>
                    </label>
                  ) : (
                    <>
                      {receiptPreviewUrl && (
                        <div className="border border-gray-300 bg-white overflow-hidden shadow-sm">
                          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-medium text-gray-700">Preview</span>
                            <button
                              type="button"
                              onClick={openReceiptFilePicker}
                              className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Reupload
                            </button>
                          </div>
                          {receiptIsPdf ? (
                            <iframe
                              title="Receipt preview"
                              src={receiptPreviewUrl}
                              className="w-full h-[min(24rem,55vh)] min-h-[220px] bg-gray-100"
                            />
                          ) : (
                            <div className="flex justify-center bg-gray-50 p-2">
                              <img
                                src={receiptPreviewUrl}
                                alt="Receipt preview"
                                className="max-h-[min(24rem,55vh)] w-full max-w-full object-contain"
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-600 px-3 py-2 border-t border-gray-200 truncate">
                            {receiptFile.name}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="receipt-ref-input"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Reference / Transaction Number (optional)
                  </label>
                  <input
                    id="receipt-ref-input"
                    type="text"
                    value={receiptRefNumber}
                    onChange={(e) => setReceiptRefNumber(e.target.value)}
                    placeholder="e.g., GCash ref #1234567890"
                    className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  />
                </div>

                <div className="flex justify-center gap-4 flex-wrap pt-2 border-t border-gray-300/80">
                  <button
                    type="button"
                    onClick={() => setPaymentStep(2)}
                    className="px-8 py-2 bg-[#1e3a5f] text-white font-medium hover:bg-[#152a45] cursor-pointer text-sm min-w-[120px]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={deploySubmit.isPending}
                    className={`px-8 py-2 text-white font-medium text-sm min-w-[120px] ${
                      deploySubmit.isPending
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#2563EB] hover:bg-[#1d4ed8] cursor-pointer'
                    }`}
                  >
                    {deploySubmit.isPending ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showPaymentSubmittedModal && paymentSubmittedSummary && (
        <div
          className="fixed inset-0 z-[105] flex items-center justify-center bg-black/50 p-4"
          onClick={closePaymentSubmittedModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg overflow-y-auto bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-submitted-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePaymentSubmittedModal}
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
            <div className="bg-[#2563EB] px-6 pt-12 pb-6 pr-14 text-white">
              <h2 id="payment-submitted-title" className="text-lg font-bold leading-tight">
                Payment Submitted
              </h2>
              <p className="mt-1 text-sm text-white/90">Pending Verification</p>
            </div>
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-gray-900">Pending Verification</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Your payment proof has been submitted. TriConnect will verify within 1–2 hours, then
                officially activate the deployment.
              </p>
              <div className="mt-5 bg-gray-100 px-4 py-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Workers</span>
                  <span className="text-right text-gray-900">{paymentSubmittedSummary.workersLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Employer</span>
                  <span className="text-right text-gray-900">{paymentSubmittedSummary.employerLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Payment Method</span>
                  <span className="text-right text-gray-900">
                    {paymentSubmittedSummary.paymentMethodLabel}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Amount Paid</span>
                  <span className="text-right text-gray-900">{paymentSubmittedSummary.amountLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Ref Number</span>
                  <span className="text-right text-gray-900">{paymentSubmittedSummary.refDisplay}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Proof Status</span>
                  <span className="text-right font-medium text-orange-500">
                    Pending Verification
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={closePaymentSubmittedModal}
                  className="min-w-[200px] bg-[#2563EB] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#1d4ed8] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPickMemberModal && (
        <div
          className="fixed inset-0 z-[102] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowPickMemberModal(false);
            setPickMemberId('');
          }}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl bg-white p-6 pt-12 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pick-member-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowPickMemberModal(false);
                setPickMemberId('');
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
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
            <h2 id="pick-member-title" className="text-lg font-bold text-[#2563EB] mb-4 pr-10">
              Add member to this deployment
            </h2>
            <p className="text-sm text-gray-600 mb-3">Select an available team member:</p>
            <select
              className="w-full border border-gray-300 px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
              value={pickMemberId}
              onChange={(e) => setPickMemberId(e.target.value)}
            >
              <option value="">— Choose member —</option>
              {availableMembersToAdd.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                  {m.jobTitle && m.jobTitle !== '—' ? ` — ${m.jobTitle}` : ''}
                </option>
              ))}
            </select>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                type="button"
                className="px-8 py-2 bg-[#1e3a5f] text-white font-medium hover:bg-[#152a45] cursor-pointer text-sm min-w-[120px]"
                onClick={() => {
                  setShowPickMemberModal(false);
                  setPickMemberId('');
                }}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!pickMemberId}
                className={`px-8 py-2 font-medium text-sm min-w-[120px] ${
                  !pickMemberId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] cursor-pointer'
                }`}
                onClick={handleAddMemberToPayment}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {viewProfileMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewProfileMember(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-xl border border-gray-300 p-6 pt-12"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="worker-details-title"
          >
            <button
              type="button"
              onClick={() => setViewProfileMember(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
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
            <h2 id="worker-details-title" className="text-lg font-bold text-[#2563EB] pr-10 mb-1">
              Worker details
            </h2>
            <p className="text-xs text-gray-500 mb-4">ID #{viewProfileMember.id}</p>
            <dl className="text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100">
                <dt className="text-gray-500 font-medium">Name</dt>
                <dd className="text-gray-900">{viewProfileMember.name}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100">
                <dt className="text-gray-500 font-medium">Job title</dt>
                <dd className="text-gray-900">{viewProfileMember.jobTitle}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100">
                <dt className="text-gray-500 font-medium">Email</dt>
                <dd className="text-gray-900 break-all">{viewProfileMember.email}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100">
                <dt className="text-gray-500 font-medium">Location</dt>
                <dd className="text-gray-900">{viewProfileMember.location}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100">
                <dt className="text-gray-500 font-medium">Years of experience</dt>
                <dd className="text-gray-900">{viewProfileMember.yearsExperience}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2 border-b border-gray-100 items-center">
                <dt className="text-gray-500 font-medium">Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-md border px-3 py-0.5 text-xs font-medium ${statusBadgeClass(viewProfileMember.status)}`}
                  >
                    {statusLabel(viewProfileMember.status)}
                  </span>
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewProfileMember(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1d4ed8] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div
            className="bg-white shadow-xl max-w-4xl w-full p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
          >
            <h2 id="add-member-title" className="text-lg font-bold text-[#2563EB] mb-4">
              Add team member
            </h2>
            <form onSubmit={handleAddMember} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Full name</span>
                <input
                  required
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  value={addDraft.name}
                  onChange={(e) => setAddDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Job title</span>
                <input
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  value={addDraft.jobTitle}
                  onChange={(e) => setAddDraft((d) => ({ ...d, jobTitle: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  value={addDraft.email}
                  onChange={(e) => setAddDraft((d) => ({ ...d, email: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Location</span>
                <input
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  value={addDraft.location}
                  onChange={(e) => setAddDraft((d) => ({ ...d, location: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Years of experience</span>
                <input
                  required
                  type="number"
                  min={0}
                  className="border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                  value={addDraft.yearsExperience}
                  onChange={(e) =>
                    setAddDraft((d) => ({ ...d, yearsExperience: e.target.value }))
                  }
                />
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-[#2563EB]/10 hover:border-[#2563EB]/50 hover:text-[#2563EB] cursor-pointer"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingMember}
                  className={`px-4 py-2 bg-[#2563EB] text-white font-medium cursor-pointer ${
                    isAddingMember ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#1d4ed8]'
                  }`}
                >
                  {isAddingMember ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageTeams;
