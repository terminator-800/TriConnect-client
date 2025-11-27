import { useVerifiedJobPosts } from '../../../../hooks/useJobposts';
import { ROLE_LABELS } from '../../../../utils/role';
import { useState } from 'react';
// import JobpostDetails from "./JobpostDetails";
import Pagination from '../../../components/Pagination';
import Sidebar from './Sidebar';
import icons from '../../../assets/svg/Icons';

const VerifiedJobPost = () => {
  const { data: verifiedJobPosts = [], isLoading, isError } = useVerifiedJobPosts();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobPost, setSelectedJobPost] = useState(null);

  const postsPerPage = 5;
  const totalPages = Math.ceil(verifiedJobPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = verifiedJobPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (isLoading) return <div>Loading job posts...</div>;
  if (isError) return <div>Error loading job posts.</div>;

  const handleViewDetails = (job) => setSelectedJobPost(job);
  const handleCloseDetails = () => setSelectedJobPost(null);

  const getPostLabel = (post_type) => {
    switch (post_type) {
      case 'job_post':
        return 'Hiring';
      case 'individual_job_post':
        return 'Individual';
      case 'team_job_post':
        return 'Team';
      default:
        return post_type;
    }
  };

  const getTypeColor = (post_type) => {
    switch (post_type) {
      case 'job_post':
        return 'bg-blue-100 text-blue-700';
      case 'individual_job_post':
        return 'bg-amber-100 text-amber-700';
      case 'team_job_post':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Add this helper
  const getRoleColor = (role) => {
    switch (role) {
      case 'manpower-provider':
        return 'text-orange-500';
      case 'business-employer':
        return 'text-green-600';
      case 'individual-employer':
        return 'text-yellow-500';
      case 'jobseeker':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        {/* HEADER */}
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Verified Job Posts</h1>
          <p>View all published and approved job posts</p>
        </div>

        {/* LIST */}
        <div className="flex-1 mt-10 overflow-y-auto">
          {verifiedJobPosts.length === 0 ? (
            <p className="text-gray-500 italic text-lg text-center">
              No verified job posts available.
            </p>
          ) : (
            <div className="flex flex-col space-y-6 overflow-x-auto">
              {currentPosts.map((job) => (
                <div
                  key={job.post_id}
                  className="relative bg-white shadow-md p-6 border border-gray-200 min-w-[700px] max-md:min-w-[100%]"
                >
                  {/* BADGES */}
                  <div className="absolute right-6 top-6 bottom-6 flex flex-col items-end justify-between">
                    <span
                      className={`${getTypeColor(job.post_type)} px-4 py-1 rounded-full text-sm font-semibold`}
                    >
                      {getPostLabel(job.post_type)}
                    </span>

                    <span className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-full font-medium flex items-center gap-1">
                      <img src={icons.verified_check} className="w-5" />
                      Verified
                    </span>

                    <span className="text-gray-500 text-sm">Verified at {job.approved_at}</span>
                  </div>

                  {/* JOB TITLE */}
                  <h2 className="text-2xl font-bold text-black mb-1">{job.job_title}</h2>

                  {/* ROLE + LOCATION */}
                  <p
                    className={`text-sm italic font-bold flex items-center gap-3 mb-3 ${getRoleColor(job.role)}`}
                  >
                    {ROLE_LABELS[job.role]}
                    <span className="text-gray-400">|</span>
                    <img src={icons.location} className="w-5" />
                    <span className="text-gray-600">{job.location}</span>
                  </p>

                  {/* CONTENT BASED ON POST TYPE */}
                  <div className="text-sm text-gray-700 space-y-1">
                    {job.post_type === 'job_post' && (
                      <>
                        <div className="flex gap-5">
                          <p>
                            <strong>Job Type:</strong> {job.job_type}
                          </p>
                          <p>
                            <strong>Salary:</strong> {job.salary_range}
                          </p>
                          <p className="max-w-4xl overflow-hidden whitespace-nowrap text-ellipsis">
                            <strong>Description:</strong> {job.job_description}
                          </p>
                        </div>
                      </>
                    )}

                    {job.post_type === 'individual_job_post' && (
                      <>
                        <div className="flex gap-5 text-sm">
                          <p>
                            <strong>Worker Name:</strong> {job.worker_name}
                          </p>
                          <p>
                            <strong>Category:</strong> {job.worker_category}
                          </p>
                          <p>
                            <strong>Experience:</strong> {job.years_of_experience} years
                          </p>
                          <p className="max-w-4xl overflow-hidden whitespace-nowrap text-ellipsis">
                            <strong>Qualifications:</strong> {job.qualifications}
                          </p>
                        </div>
                      </>
                    )}

                    {job.post_type === 'team_job_post' && (
                      <>
                        <div className="flex gap-5">
                          <p>
                            <strong>Category:</strong> {job.worker_category}
                          </p>
                          <p>
                            <strong>Team Size:</strong> {job.number_of_workers}
                          </p>
                          <p className="max-w-4xl overflow-hidden whitespace-nowrap text-ellipsis">
                            <strong>Skillset:</strong> {job.team_skills}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* DETAILS BUTTON */}
                  <button
                    onClick={() => handleViewDetails(job)}
                    className="mt-5 bg-gray-200 text-gray-700 px-10 py-1 hover:bg-gray-300 text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-5 mb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* DETAILS MODAL */}
        {selectedJobPost && (
          <JobpostDetails jobPost={selectedJobPost} onClose={handleCloseDetails} />
        )}
      </div>
    </>
  );
};

const JobpostDetails = ({ jobPost, onClose }) => {
  if (!jobPost) return null;

  const renderField = (label, value) => {
    if (value === null || value === undefined) return null;
    return (
      <p className="mb-2 max-w-full break-words line-clamp-3">
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ml-55 bg-opacity-50">
      <div className="backdrop-blur-2xl shadow-lg p-6 w-full max-w-5xl max-h-[150vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 absolute top-4 right-8 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-3">{jobPost.job_title}</h2>
        {jobPost.location && (
          <p className="text-sm italic text-gray-500 mb-4 flex items-center gap-2">
            <img src={icons.location} className="w-4" />
            {jobPost.location}
          </p>
        )}

        {/* Post Info */}
        <div className="text-sm text-gray-700 space-y-2">
          {renderField('Post Type', jobPost.post_type)}
          {renderField('Email', jobPost.email)}
          {renderField('Role', jobPost.role)}
          {renderField('Verified At', jobPost.verified_at)}
          {renderField('Approved At', jobPost.approved_at)}

          {/* Fields for job_post */}
          {jobPost.post_type === 'job_post' && (
            <>
              {renderField('Job Type', jobPost.job_type)}
              {renderField('Salary', jobPost.salary_range)}
              {renderField('Description', jobPost.job_description)}
            </>
          )}

          {/* Fields for individual_job_post */}
          {jobPost.post_type === 'individual_job_post' && (
            <>
              {renderField('Worker Name', jobPost.worker_name)}
              {renderField('Category', jobPost.worker_category)}
              {renderField('Experience (years)', jobPost.years_of_experience)}
              {renderField('Qualifications', jobPost.qualifications)}
            </>
          )}

          {/* Fields for team_job_post */}
          {jobPost.post_type === 'team_job_post' && (
            <>
              {renderField('Category', jobPost.worker_category)}
              {renderField('Team Size', jobPost.number_of_workers)}
              {renderField('Senior Workers', jobPost.senior_workers)}
              {renderField('Mid-level Workers', jobPost.mid_level_workers)}
              {renderField('Junior Workers', jobPost.junior_workers)}
              {renderField('Entry-level Workers', jobPost.entry_level_workers)}
              {renderField('Skillset', jobPost.team_skills)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedJobPost;
