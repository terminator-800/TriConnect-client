import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import BrowseJob from './BrowseJob';
import VerificationStatus from '../Verification Form/VerificationStatus';
import Form from '../Verification Form/Form';

const FindJob = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError,
    refetch,
  } = useUserProfile(ROLE.JOBSEEKER);

  if (loadingProfile) return <div>Skeleton loading</div>;
  if (isError) return <div>Failed to load profile.</div>;

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  return (
    <>
      {/*  */}
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 pr-4 pt-30 
          sm:pl-auto
          md:px-auto
          lg:pl-70
          sm:pr-6 
          md:pr-8 
          lg:px-auto 
          sm:pt-20 
          md:pt-30 
          sm:mt-0
          "
          >    
    {profileData.is_verified ? (
          <BrowseJob />
        ) : (
         <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-4 sm:px-10 md:px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
         </div>
        )}

        {showForm && (
          <Form
            onClose={() => {
              setShowForm(false);
              document.body.style.overflow = 'auto';
            }}
            onSubmitSuccess={() => {
              setShowForm(false);
              refetch();
            }}
          />
        )}
      </div>
    </>
  );
};

export default FindJob;
