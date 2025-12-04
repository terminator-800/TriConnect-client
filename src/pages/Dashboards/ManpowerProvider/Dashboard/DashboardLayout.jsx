import { useState } from 'react';
import Sidebar from '../Sidebar';
import JobPostForm from '../../../../components/CreateJobPost/HiringJobPostForm';
import MainContent from './MainContent';
import { ROLE } from '../../../../../utils/role';
import BrowseJob from './BrowseJob';
import IndividualJobPostForm from '../../../../components/CreateJobPost/IndividualJobPostForm';
import TeamJobPostForm from '../../../../components/CreateJobPost/TeamJobPostForm';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import VerificationStatus from '../../../Dashboards/ManpowerProvider/VerificationForm/VerificationStatus';
import Form from '../VerificationForm/Form';

const DashboardLayout = () => {
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showFindWorkers, setShowFindWorkers] = useState(false);
  const [postType, setPostType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const {
    data: provider,
    isLoading: isProviderLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  if (isProviderLoading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Sidebar />
      {provider && provider.is_verified ? (
        <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
          {/* Header */}
          <div className="bg-white shadow-md py-6 px-10 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#003479]">
                {showFindWorkers ? 'Find Workers' : 'Welcome, Man Power Provider!'}
              </h1>
              <p>
                {showFindWorkers
                  ? 'Browse available workers from manpower agencies'
                  : 'Your hiring platform statistics at a glance'}
              </p>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFindWorkers(!showFindWorkers)}
                className="text-blue-900 border border-blue-900 font-semibold px-10 py-1 rounded hover:bg-blue-700 hover:text-white transition cursor-pointer"
              >
                {showFindWorkers ? '← Dashboard' : 'Find Jobs'}
              </button>

              <select
                className="text-[#6B7280] outline rounded-lg border-[#6B7280] px-5 py-2  transition cursor-pointer"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;
                  setPostType(value);
                  setShowJobPostModal(true);
                }}
              >
                <option value="" hidden>
                  {' '}
                  + Post Job{' '}
                </option>
                <option value="hiring">Hiring Post</option>
                <option value="individual">Individual Post</option>
                <option value="team">Team Post</option>
              </select>
            </div>
          </div>

          {/* Conditional Content */}
          {showFindWorkers ? <BrowseJob /> : <MainContent />}
        </div>
      ) : (
        <div className='className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30'>
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
            <VerificationStatus profileData={provider} openForm={openForm} />
          </div>
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
            document.body.style.overflow = 'auto';
            refetch();
          }}
        />
      )}

      {/* Job Post Modal */}
      {showJobPostModal &&
        (postType === 'individual' ? (
          <IndividualJobPostForm
            onClose={() => setShowJobPostModal(false)}
            role={ROLE.MANPOWER_PROVIDER}
          />
        ) : postType === 'team' ? (
          <TeamJobPostForm
            onClose={() => setShowJobPostModal(false)}
            role={ROLE.MANPOWER_PROVIDER}
          />
        ) : (
          <JobPostForm
            onClose={() => setShowJobPostModal(false)}
            role={ROLE.MANPOWER_PROVIDER}
            postType={postType}
          />
        ))}
    </>
  );
};

export default DashboardLayout;
