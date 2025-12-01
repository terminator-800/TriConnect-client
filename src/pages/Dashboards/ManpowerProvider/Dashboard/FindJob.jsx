import { useState } from 'react';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../VerificationForm/VerificationStatus';
import BrowseJob from './BrowseJob';
import Sidebar from '../Sidebar';
import Form from '../VerificationForm/Form';

const FindJob = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError,
    refetch,
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);

  if (loadingProfile) return <div>Loading profile...</div>;
  if (isError) return <div>Failed to load profile.</div>;

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        {profileData.is_verified ? (
          <BrowseJob />
        ) : profileData.is_rejected ? (
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
          </div>
        ) : profileData.is_submitted ? (
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
          </div>
        ) : (
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
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
