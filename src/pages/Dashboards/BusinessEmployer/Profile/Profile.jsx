import { useState, useEffect } from 'react';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../VerificationForm/VerificationStatus';
import PersonalInfo from '../Profile/PersonalInfo';
import Security from '../Profile/Security';
import Sidebar from '../Sidebar';
import icons from '../../../../assets/svg/Icons';
import Form from '../VerificationForm/Form';
import ChangeProfile from '../../../../components/ChangeProfile/ChangeProfile';

const Profile = () => {
  const personal = 'personal';
  const security = 'security';
  const [activeTab, setActiveTab] = useState(personal);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    data: profileData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.BUSINESS_EMPLOYER);
  
  const [formData, setFormData] = useState({
    email: '',
    business_name: '',
    industry: '',
    authorized_person: '',
    business_address: '',
    business_size: '',
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        email: profileData.email || '',
        business_name: profileData.business_name || '',
        industry: profileData.industry || '',
        authorized_person: profileData.authorized_person || '',
        business_address: profileData.business_address || '',
        business_size: profileData.business_size || '',
      });
    }
  }, [profileData]);

  const openForm = () => {
    setShowForm(true);
  };

  if (loading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Sidebar />

      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
          <div>
            {profileData.is_verified ? (
              <>
                <div className="flex items-center pt-20 justify-between w-full">
                  <div>
                    <h1 className="font-bold text-4xl text-[#2563EB]">{profileData.business_name}</h1>

                    <div className="bg-[#FFF9E6] rounded p-3 shadow-md flex justify-between items-center w-full border border-[#D4A017] mt-5">
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

                  <div className="ml-6">
                    <ChangeProfile profileData={profileData} />
                  </div>
                </div>

                <div className="bg-white w-full flex justify-between mt-20 gap-5">
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
                      ${activeTab === security ? 'bg-[#2563EB] text-white' : 'bg-white border border-blue-900 text-blue-900'}`}
                  >
                    Security
                  </button>
                </div>

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
              </>
            ) : (
              <VerificationStatus profileData={profileData} openForm={openForm} />
            )}
          </div>
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
};

export default Profile;
