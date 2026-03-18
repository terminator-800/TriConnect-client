import { useState, useReducer } from 'react';
import { modalReducer, initialState } from './reducer';
import { useJobPostsByUser } from '../../../../../hooks/useJobposts';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import VerificationStatus from '../../../Dashboards/IndividualEmployer/Verification Form/VerificationStatus';
import ConfirmStatusChange from '../../../../components/ConfirmStatusChange';
import ConfirmDeleteJobPost from '../../../../components/ConfirmDeleteJobPost/ConfirmDeleteJobPost';
import JobTable from './JobTable';
import Sidebar from '../Sidebar';
import Form from '../../../Dashboards/IndividualEmployer/Verification Form/Form';
import ViewJobPost from '../../../../components/ViewJobPost/ViewJobPost';

const ManageJobPost = () => {
  const [showForm, setShowForm] = useState(false);
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const [showViewJobModal, setShowViewJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const {
    data: employer,
    isLoading: isEmployerLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);
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
        postType: job.post_type,
      },
    });
  };

  const closeStatusModal = () => dispatch({ type: 'CLOSE_STATUS_MODAL' });

  if (isEmployerLoading || isJobsLoading) return <div className="p-10">Loading...</div>;
  if (isError || !employer) return <div className="p-10 text-red-600">Error: {error?.message}</div>;

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
        {employer.is_verified ? (
          <>
            <div className="bg-white shadow-md py-6 px-10 mb-8">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-[#2563EB]">Manage Job Post</h1>
                <p>View and manage all your job postings</p>
              </div>
            </div>

            {['pending', 'active', 'completed'].map((key) => (
              <JobTable
                key={key}
                title={`${key[0].toUpperCase()}${key.slice(1)} Job Post`}
                jobs={jobPostsGrouped[key]}
                onStatusChange={openStatusConfirmModal}
                onDelete={handleDeleteClick}
                onViewJobDetails={openViewJobModal}
              />
            ))}
          </>
        ) : (
          <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
            <VerificationStatus profileData={employer} openForm={openForm} />
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
          role={ROLE.INDIVIDUAL_EMPLOYER}
        />
      )}

      {state.showStatusModal && (
        <ConfirmStatusChange
          data={state.statusChangeData}
          onClose={closeStatusModal}
          role={ROLE.INDIVIDUAL_EMPLOYER}
          postType={"job_post"}
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
