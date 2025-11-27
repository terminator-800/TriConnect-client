import { useMemo, useState } from 'react';
import { useApplicants } from '../../../../../hooks/useApplicants';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../VerificationForm/VerificationStatus';
import ApplicantMenu from './ApplicantMenu';
import RejectApplicant from './RejectApplicant';
import Pagination from '../../../../components/Pagination';
import Sidebar from '../Sidebar';
import icons from '../../../../assets/svg/Icons';
import Form from '../VerificationForm/Form';

const ViewApplicant = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const { data, isLoading, error } = useApplicants({
    page: currentPage,
    pageSize,
    role: ROLE.MANPOWER_PROVIDER,
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  const closeForm = () => {
    document.body.style.overflow = 'auto';
    setShowForm(false);
  };

  const rows = data?.applicants || [];
  const total = data?.total || 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  if (loadingProfile) return <div>Loading profile...</div>;
  if (isProfileError)
    return <div>Error loading profile: {profileError?.message || 'Unknown error'}</div>;

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        <div>
          {profileData?.is_verified ? (
            <>
              <div className="bg-white shadow-md py-6 px-10 mb-8">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-blue-900">View Applicants</h1>
                  <p>Manage applicants for your job postings</p>
                </div>
              </div>

              <div className="flex-1 mt-10">
                <div className="shadow-lg border border-gray-300 bg-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-300 text-[#374151]">
                        <th className="text-left py-3 px-4 font-semibold">Applicant Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Job Position</th>
                        <th className="text-left py-3 px-4 font-semibold">Location</th>
                        <th className="text-left py-3 px-4 font-semibold">Date Applied</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            Loading...
                          </td>
                        </tr>
                      )}

                      {!isLoading && rows.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                            No applicants found.
                          </td>
                        </tr>
                      )}

                      {!isLoading &&
                        rows.map((applicant) => (
                          <tr
                            key={applicant.application_id}
                            className="border-b border-gray-300 relative"
                          >
                            <td className="py-3 px-4">{applicant.applicant_name}</td>
                            <td className="py-3 px-4">{applicant.job_title}</td>
                            <td className="py-3 px-4">{applicant.location || '-'}</td>
                            <td className="py-3 px-4">{applicant.applied_at_formatted || '-'}</td>
                            <td className="py-3 px-4">
                              <button
                                className="cursor-pointer"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === applicant.application_id
                                      ? null
                                      : applicant.application_id
                                  )
                                }
                              >
                                <img src={icons.three_dots} alt="" />
                              </button>

                              {openMenuId === applicant.application_id && (
                                <ApplicantMenu
                                  onRejectClick={() => {
                                    setSelectedApplication(applicant);
                                    setShowRejectModal(true);
                                    setOpenMenuId(null);
                                  }}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {error && (
                    <div className="px-4 py-3 text-red-600 text-sm border-t border-gray-200">
                      Failed to load applicants
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
              <VerificationStatus profileData={profileData} openForm={openForm} />
            </div>
          )}
        </div>

        <div className="mt-10 mb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {showForm && (
        <Form
          onClose={closeForm}
          onSubmitSuccess={() => {
            closeForm();
            refetchProfile();
          }}
        />
      )}

      {showRejectModal && selectedApplication && (
        <RejectApplicant
          application={selectedApplication}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </>
  );
};

export default ViewApplicant;
