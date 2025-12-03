import { useUncontactedAgencies } from '../../../../../hooks/useUncontactedAgencies';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../../../../pages/Dashboards/Jobseeker/Verification Form/VerificationStatus';
import MessageAgency from '../../../../components/MessageAgency';
import Sidebar from '../Sidebar';
import Form from '../../../../pages/Dashboards/Jobseeker/Verification Form/Form';
import Pagination from '../../../../components/Pagination';
import DisabledAccount from '../../../../components/DisabledAccount';

const FindAgency = () => {
  const {
    data: profileData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.JOBSEEKER);

  const {
    agencies = [],
    isLoading: isAgenciesLoading,
    error: agencyError,
  } = useUncontactedAgencies(ROLE.JOBSEEKER);

  const [currentPage, setCurrentPage] = useState(1);
  const agenciesPerPage = 4;
  const totalPages = agencies.length > 0 ? Math.ceil(agencies.length / agenciesPerPage) : 1;
  const startIndex = (currentPage - 1) * agenciesPerPage;
  const currentAgencies = agencies.slice(startIndex, startIndex + agenciesPerPage);

  const [showApply, setShowApply] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openApply = (agency) => {
    setSelectedAgency(agency);
    setShowApply(true);
  };

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  if (loading || !profileData) {
    return (
      <>
        <Sidebar />
        <div className="pl-110 pr-50 pt-50 p-10 min-h-screen text-xl">Loading profile...</div>
      </>
    );
  }

  if (isError || agencyError) {
    return (
      <>
        <Sidebar />
        <div className="pl-110 pr-50 pt-50 p-10 text-red-600">
          An error occurred: {error?.message || agencyError?.message || 'Unknown error.'}
        </div>
      </>
    );
  }

  // Check if hired - show disabled account
  if (profileData.is_verified && profileData.employment_status === 'hired') {
    return (
      <>
        <Sidebar />
        <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">

        <DisabledAccount 
          contractData={{
            employer: profileData.employer_name,
            job_title: profileData.job_title,
            start_date: profileData.contract_start_date,
            end_date: profileData.contract_end_date,
          }}
        />
        </div>
      </>
    );
  }

  // Check if not verified - show verification status
  if (!profileData.is_verified) {
    return (
      <>
        <Sidebar />
        <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
          </div>

          {showForm && (
            <Form
              onClose={() => setShowForm(false)}
              onSubmitSuccess={() => {
                setShowForm(false);
                refetch();
              }}
            />
          )}
        </div>
      </>
    );
  }

  // If verified and not hired, show normal Find Agency page
  return (
    <>
      <Sidebar />

      {showApply && selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 max-[769px]:px-5">
          <MessageAgency
            sender={profileData}
            receiver={selectedAgency}
            role={ROLE.JOBSEEKER}
            onClose={() => setShowApply(false)}
          />
        </div>
      )}

      {showForm && (
        <Form
          profileData={profileData}
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

      <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-900">Search for Manpower Provider</h1>
            <p>Find agencies to help you get hired</p>
          </div>
        </div>

        {isAgenciesLoading ? (
          <p className="mt-10 text-lg">Loading agencies...</p>
        ) : agencies.length === 0 ? (
          <p className="mt-10 text-lg italic text-gray-500">No manpower providers found.</p>
        ) : (
          <>
            <div className="flex flex-col min-h-[65vh]">
              <div
                className="grid grid-cols-2 gap-6 mt-15
                            max-[576px]:grid-cols-1"
              >
                {currentAgencies.map((agency) => (
                  <div
                    key={agency.agency_id}
                    className="flex flex-col bg-white border border-gray-300 p-6 shadow-md"
                  >
                    <div
                      className="flex items-center gap-4
                    max-[691px]:flex-col
                    "
                    >
                      {/* PROFILE */}
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                        {agency.profile ? (
                          <img
                            src={agency.profile}
                            alt={agency.agency_name || 'Agency'}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800">
                            {(agency.agency_name || '').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold">{agency.agency_name}</h2>
                    </div>

                    <div
                      className="flex justify-between mt-6
                    max-[691px]:flex-col
                    max-[691px]:gap-5
                    "
                    >
                      <button
                        onClick={() => openApply(agency)}
                        className="bg-blue-900 text-white px-10 py-1 cursor-pointer"
                      >
                        Message
                      </button>
                      <button className="border border-gray-400 px-10 py-1 cursor-pointer">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pb-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FindAgency;