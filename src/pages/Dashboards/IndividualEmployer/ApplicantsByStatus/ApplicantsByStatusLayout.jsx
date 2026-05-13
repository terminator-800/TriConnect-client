import { useMemo, useState } from 'react';
import { useApplicants } from '../../../../../hooks/useApplicants';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../Verification Form/VerificationStatus';
import Sidebar from '../Sidebar';
import Form from '../Verification Form/Form';
import Pagination from '../../../../components/Pagination';
import ContactApplicantLayout from '../../../../components/ContactApplicant/ContactApplicantLayout';
import ViewProfile from '../../../../components/ViewProfile';

const ApplicantsByStatusLayout = ({ status = 'accepted', pageTitle, subtitle, emptyLabel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const { data, isLoading, error } = useApplicants({
    page: currentPage,
    pageSize,
    role: ROLE.INDIVIDUAL_EMPLOYER,
    status,
  });

  const [showForm, setShowForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContactApplicant, setSelectedContactApplicant] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);

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
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        <div>
          {profileData?.is_verified ? (
            <>
              <div className="bg-white shadow-md py-6 px-10 mb-8">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-[#2563EB]">{pageTitle}</h1>
                  <p>{subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {isLoading && (
                  <div className="bg-white border border-gray-300 px-6 py-12 text-center text-gray-500">
                    Loading...
                  </div>
                )}

                {!isLoading && rows.length === 0 && (
                  <div className="bg-white border border-gray-300 px-6 py-12 text-center text-gray-500 italic">
                    {emptyLabel}
                  </div>
                )}

                {!isLoading &&
                  rows.map((applicant) => (
                    <div
                      key={applicant.application_id}
                      className="bg-white border border-gray-300 shadow-sm px-8 py-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">{applicant.applicant_name}</h2>
                          <p className="text-sm text-gray-500">
                            {applicant.job_title} |{' '}
                            {status === 'accepted' ? 'Hired' : 'Rejected'} on{' '}
                            {applicant.applied_at_formatted || '-'}
                          </p>
                        </div>
                        <button
                          className="bg-[#2563EB] text-white px-8 py-2 cursor-pointer hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            setSelectedContactApplicant(applicant);
                            setShowContactModal(true);
                          }}
                        >
                          Send Message
                        </button>
                      </div>

                      <div className="mt-6 space-y-3 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Email:</span> {applicant.email || '-'}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span> {applicant.phone || '-'}
                        </p>
                        <p>
                          <span className="font-semibold">Resume:</span>{' '}
                          {applicant.resume ? (
                            <a
                              href={applicant.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View resume
                            </a>
                          ) : (
                            '-'
                          )}
                        </p>
                        <button
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowProfileModal(true);
                          }}
                        >
                          View profile
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {error && <div className="mt-4 text-red-600 text-sm">Failed to load applicants</div>}
            </>
          ) : (
            <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
              <VerificationStatus profileData={profileData} openForm={openForm} />
            </div>
          )}
        </div>

        {profileData?.is_verified && (
          <div className="mt-10 mb-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
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

      {showContactModal && selectedContactApplicant && (
        <ContactApplicantLayout
          applicant={selectedContactApplicant}
          role={ROLE.INDIVIDUAL_EMPLOYER}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContactApplicant(null);
          }}
        />
      )}

      {showProfileModal && selectedApplicant && (
        <ViewProfile
          applicant={selectedApplicant}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedApplicant(null);
          }}
        />
      )}
    </>
  );
};

export default ApplicantsByStatusLayout;
