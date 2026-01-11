import { useState } from 'react';
import Sidebar from '../Sidebar';
import JobPostForm from '../../../../components/CreateJobPost/HiringJobPostForm';
import MainContent from './MainContent';
import FindWorkers from './FindWorkers';
import { ROLE } from '../../../../../utils/role';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import VerificationStatus from '../../../Dashboards/BusinessEmployer/VerificationForm/VerificationStatus';
import Form from '../Verification Form/Form';

const DashboardLayout = () => {
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showFindWorkers, setShowFindWorkers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    data: employer = null,
    isLoading: isEmployerLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  if (isEmployerLoading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Sidebar />
      {employer && employer.is_verified ? (
        <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
          {/* Header */}
          <div className="bg-white shadow-md py-6 px-10 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#003479]">
                {showFindWorkers ? 'Find Workers' : 'Welcome, Employer!'}
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
                {showFindWorkers ? '← Dashboard' : 'Find Workers'}
              </button>

              <button
                onClick={() => setShowJobPostModal(true)}
                className="bg-[#2563EB] text-white px-5 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                + Post Job
              </button>
            </div>
          </div>

          {/* Conditional Content */}
          {showFindWorkers ? <FindWorkers /> : <MainContent />}
        </div>
      ) : (
        <div className='className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30'>
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
            <VerificationStatus profileData={employer} openForm={openForm} />
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
      {showJobPostModal && (
        <JobPostForm onClose={() => setShowJobPostModal(false)} role={ROLE.INDIVIDUAL_EMPLOYER} />
      )}
    </>
  );
};

export default DashboardLayout;
