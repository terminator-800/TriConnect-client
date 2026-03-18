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
import { LocationIcon } from '../../../../assets/icon2/icon2';

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
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
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
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 pr-4 pt-30 sm:pl-auto md:px-auto lg:pl-70 sm:pr-6 md:pr-8 lg:px-auto sm:pt-20 md:pt-30 sm:mt-0">
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-0 sm:px-10 md:px-20">
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

      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] px-5 pt-30 ml-60 max-[1279px]:ml-60 max-[1024px]:ml-0">
        <div className="bg-white shadow-md py-6 px-10 mb-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#2563EB]">Search for Manpower Provider</h1>
            <p>Find agencies to help with your recruitment needs</p>
          </div>
        </div>

        {isAgenciesLoading ? (
          <p className="mt-10 text-lg">Loading agencies...</p>
        ) : agencies.length === 0 ? (
          <p className="mt-10 text-lg italic text-gray-500 text-center">No manpower providers found.</p>
        ) : (
          <>
            <div className="flex flex-col min-h-[65vh] ">
              <div className='flex flex-col gap-5 drop-shadow-2xl'>
                {currentAgencies.map((agency) => (
                  <div
                    key={agency.agency_id}
                    onClick={() => openApply(agency)}
                    className="flex flex-col bg-white p-6 shadow-md cursor-pointer hover:bg-gray-50 transition"
                  >

                    <div className="flex items-start max-[425px]:items-center gap-4 md:flex-row flex-col">
                      {/* PROFILE */}
                      <div className="w-14 h-14 rounded-sm overflow-hidden shrink-0">
                        {agency.profile ? (
                          <img
                            src={agency.profile}
                            alt={agency.agency_name || 'Agency'}
                            className="w-full h-full object-cover "
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800">
                            {(agency.agency_name || '').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className='text-left'>
                        <h2 className="text-xl font-semibold">{agency.agency_name}</h2>
                        <span className='text-[#828282]'>{agency.agency_services}</span>
                      </div>

                    </div>
                     
                    <div className="flex justify-between mt-6 xl:flex-row md:flex-row sm:flex-row flex-col gap-5">
                      <div className='text-[#828282] flex gap-2'>
                        <LocationIcon/>
                        <span >{agency.agency_address} </span>
                      </div>

                      <button className="bg-[#2563EB] text-white xl:px-10 md:px-10  sm:px-10 px-2 py-1 cursor-pointer">
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