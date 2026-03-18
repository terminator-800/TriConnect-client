import { useState, useReducer } from 'react';
import { modalReducer, initialState } from './reducer';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { useJobPostsByUser } from '../../../../../hooks/useJobposts';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../VerificationForm/VerificationStatus';
import ConfirmStatusChange from '../../../../components/ConfirmStatusChange';
import ConfirmDeleteJobPost from '../../../../components/ConfirmDeleteJobPost/ConfirmDeleteJobPost';
import Sidebar from '../Sidebar';
import JobTable from './JobTable';
import Form from '../VerificationForm/Form';
import ViewJobPost from '../../../../components/ViewJobPost/ViewJobPost';

const ManageJobPost = () => {
  const [showForm, setShowForm] = useState(false);
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const [showViewJobModal, setShowViewJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activePostType, setActivePostType] = useState('hiring');

  const {
    data: provider,
    isLoading: isProviderLoading,
    isError,
    refetch,
  } = useUserProfile(ROLE.MANPOWER_PROVIDER);
  const {
    data: jobPostsGrouped = { pending: [], active: [], completed: [] },
    isLoading: isJobsLoading,
  } = useJobPostsByUser();

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  const handleDeleteClick = (job) => dispatch({ type: 'OPEN_DELETE_MODAL', payload: job });
  const closeDeleteModal = () => dispatch({ type: 'CLOSE_DELETE_MODAL' });

  const openStatusConfirmModal = ({ jobPostId, status, job }) => {
    dispatch({
      type: 'OPEN_STATUS_MODAL',
      payload: {
        jobPostId,
        status,
        job_title: job.job_title,
        location: job.location,
        salary_range: job.salary_range,
      },
    });
  };

  const closeStatusModal = () => dispatch({ type: 'CLOSE_STATUS_MODAL' });

  // Map active tab to post_type values
  const postTypeMap = {
    hiring: 'job_post',
    individual: 'individual_job_post',
    team: 'team_job_post',
  };

  // Filter jobs by post_type based on selected tab
  const filterJobsByPostType = (jobs) => {
    const targetPostType = postTypeMap[activePostType];
    return jobs.filter((job) => job.post_type === targetPostType);
  };

  if (isProviderLoading || isJobsLoading) return <div className="p-10">Loading...</div>;
  if (isError || !provider) return <div className="p-10 text-red-600">Error!</div>;

  const openViewJobModal = (job) => {
    setSelectedJob(job);
    document.body.style.overflow = 'hidden';
    setShowViewJobModal(true);
  };

  const closeViewJobModal = () => {
    setSelectedJob(null);
    document.body.style.overflow = 'auto';
    setShowViewJobModal(false);
  };

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        {provider.is_verified ? (
          <>
            <div className="bg-white shadow-md py-6 px-10 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-[#2563EB]">Manage Job Post</h1>
                  <p>View and manage all your job postings</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePostType('hiring')}
                    className={`px-6 py-2 rounded font-medium transition-colors ${
                      activePostType === 'hiring'
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Hiring Post
                  </button>
                  {/* <button
                    onClick={() => setActivePostType('individual')}
                    className={`px-6 py-2 rounded font-medium transition-colors ${
                      activePostType === 'individual'
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Individual Post
                  </button>
                  <button
                    onClick={() => setActivePostType('team')}
                    className={`px-6 py-2 rounded font-medium transition-colors ${
                      activePostType === 'team'
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Team Post
                  </button> */}
                </div>
              </div>
            </div>

            {['pending', 'active', 'completed', 'rejected'].map((key) => (
              <JobTable
                key={`${key}-${activePostType}`}
                title={`${key[0].toUpperCase()}${key.slice(1)} Job Post`}
                jobs={filterJobsByPostType(jobPostsGrouped[key] || [])}
                onStatusChange={openStatusConfirmModal}
                onDelete={handleDeleteClick}
                onViewJobDetails={openViewJobModal}
                activePostType={activePostType}
              />
            ))}
          </>
        ) : (
          <div className="bg-white shadow-md p-6 w-full max-w-full border border-gray-300 px-20">
            <VerificationStatus profileData={provider} openForm={openForm} />
          </div>
        )}
      </div>

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

      {state.showDeleteModal && (
        <ConfirmDeleteJobPost
          data={state.deleteTargetJob}
          onClose={closeDeleteModal}
          role={ROLE.MANPOWER_PROVIDER}
        />
      )}

      {state.showStatusModal && (
        <ConfirmStatusChange
          data={state.statusChangeData}
          onClose={closeStatusModal}
          role={ROLE.MANPOWER_PROVIDER}
          postType={postTypeMap[activePostType]}
        />
      )}

      {showViewJobModal && (
        <ViewJobPost
          data={
            selectedJob ? { active: [selectedJob], pending: [], completed: [] } : jobPostsGrouped
          }
          role={ROLE.INDIVIDUAL_EMPLOYER}
          onClose={closeViewJobModal}
        />
      )}
    </>
  );
};

export default ManageJobPost;
