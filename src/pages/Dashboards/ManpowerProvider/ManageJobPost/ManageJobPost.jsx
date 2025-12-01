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

  const {
    data: provider,
    isLoading: isProviderLoading,
    isError,
    error,
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
      <div className="relative min-h-[500vh] bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        {provider.is_verified ? (
          <>
            <div className="bg-white shadow-md py-6 px-10 mb-8">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-blue-900">Manage Job Post</h1>
                <p>View and manage all your job postings</p>
              </div>
            </div>

            {['pending', 'active', 'completed', 'rejected'].map((key) => (
              <JobTable
                key={key}
                title={`${key[0].toUpperCase()}${key.slice(1)} Job Post`}
                jobs={jobPostsGrouped[key] || []} // fallback if undefined
                onStatusChange={openStatusConfirmModal}
                onDelete={handleDeleteClick}
                onViewJobDetails={openViewJobModal}
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
