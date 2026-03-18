import { useState, useEffect } from 'react';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import Sidebar from '../Sidebar';
import icons from '../../../../assets/svg/Icons';
import Form from '../Verification Form/Form';
import PersonalInfo from './PersonalInfo';
import Security from './Security';
import VerificationStatus from '../Verification Form/VerificationStatus';
import ChangeProfile from '../../../../components/ChangeProfile/ChangeProfile';
import DisabledAccount from '../../../../components/DisabledAccount';
import SkeletonProfile from '../../../../components/animation/ProfileSkeleton';
import ResumeSection from './ResumeSection';

const JobseekerProfile = () => {
  const personal = 'personal';
  const security = 'security';
  const [activeTab, setActiveTab] = useState(personal);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    gender: '',
  });

  const {
    data: profileData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useUserProfile(ROLE.JOBSEEKER);
  
  const loading = isLoading || isFetching;

  useEffect(() => {
    if (profileData) {
      setFormData({
        email: profileData.email || '',
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        gender: profileData.gender || '',
      });
    }
  }, [profileData]);

  const openForm = () => setShowForm(true);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading || isFetching) {
    return (
      <>
        <Sidebar />
        <SkeletonProfile />
      </>
    );
  }

  if (isError) return <div>Failed to fetch profile data.</div>;

  return (
    <>
      <Sidebar />

      {profileData.is_verified && profileData.employment_status === 'hired' ? (
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
      ) : (
          <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 pr-4 pt-30 pb-10 sm:pl-auto md:px-auto lg:pl-70 sm:pr-6 md:pr-8 lg:px-auto sm:pt-20 md:pt-30 sm:mt-0">          <div className="bg-white shadow-md md:h-screen p-6 w-full max-w-full border border-gray-300 px-4 sm:px-10 md:px-20">
            {profileData.is_verified ? (
              <div className="flex flex-col">
                {/* HEADER */}
                <div className="flex items-center pt-20 justify-between w-full">
                  <div>
                    <h1 className="font-bold text-4xl text-[#2563EB]">{profileData.full_name}</h1>
                    <div className="bg-[#FFF9E6] border border-[#D4A017] p-3 shadow-md flex justify-between items-center w-full rounded mt-5">
                      <div className="flex gap-4 items-center">
                        <div>
                          <div className="flex">
                            <h1 className="font-bold text-2xl text-[#8B6914]">Account Verified</h1>
                            <img src={icons.verified} alt="" />
                          </div>
                          <p className="text-[#8B6914] max-w-4xl">
                            Your account has been successfully verified and all submitted
                            requirements have been approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Profile */}
                  <div className="ml-6">
                    <ChangeProfile profileData={profileData} />
                  </div>
                </div>

                {/* 🔥 FLEX ROW: Tabs LEFT / Resume RIGHT */}
                <div className="flex gap-10 h-[50vh] my-20">
                  {/* LEFT SIDE */}
                  <div className="w-1/2">
                    {/* Tabs */}
                    <div className="bg-white w-full flex justify-between gap-5">
                      <button
                        onClick={() => setActiveTab(personal)}
                        className={`px-10 py-5 w-full cursor-pointer transition-all duration-200
                      ${activeTab === personal ? 'bg-[#2563EB] text-white' : 'bg-white border border-blue-900 text-blue-900'}`}
                      >
                        Personal Information
                      </button>
                      <button
                        onClick={() => setActiveTab(security)}
                        className={`px-10 py-5 w-full cursor-pointer transition-all duration-200
                      ${activeTab === security ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#CCCCCC] text-[#333333]'}`}
                      >
                        Security
                      </button>
                    </div>

                    <div>
                      {activeTab === personal && (
                        <PersonalInfo
                          formData={formData}
                          profileData={profileData}
                          editMode={editMode}
                          handleInputChange={handleInputChange}
                          setEditMode={setEditMode}
                          setFormData={setFormData}
                        />
                      )}
                      {activeTab === security && <Security />}
                    </div>
                  </div>

                  {/* RIGHT SIDE (Resume) */}
                  <ResumeSection
                    uploadedUrl={profileData.resume} // this will show the uploaded resume
                    onDownload={() => {
                      if (profileData.resume) window.open(profileData.resume, '_blank');
                    }}
                    onResubmit={() => refetch()}
                  />
                </div>
              </div>
            ) : profileData.is_rejected ? (
              <VerificationStatus profileData={profileData} openForm={openForm} />
            ) : profileData.is_submitted ? (
              <VerificationStatus profileData={profileData} openForm={openForm} />
            ) : (
              <VerificationStatus profileData={profileData} openForm={openForm} />
            )}
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
      )}
    </>
  );
};

export default JobseekerProfile;
