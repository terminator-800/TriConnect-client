import { usePendingJobPosts } from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Pagination from '../../../../components/Pagination';
import ApprovedJobPost from './ApprovedJobPost';
import RejectJobPost from './RejectJobPost';

const POSTS_PER_PAGE = 4;

const getSubmitterInfo = (post) => {
  if (post.role === ROLE.MANPOWER_PROVIDER) return `Authorized Person: ${post.submitted_by}`;
  if (post.role === ROLE.BUSINESS_EMPLOYER)
    return `Business name: ${post.employer_name} | Authorized Person: ${post.authorized_person}`;
  if (post.role === ROLE.INDIVIDUAL_EMPLOYER) return `Authorized Person: ${post.full_name}`;
  return '';
};

const JobPostHeader = ({ post, submitterInfo }) => (
  <div className="flex justify-between items-start mb-2">
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold">{post.job_title}</h2>
      <p className="text-gray-600 font-medium">{submitterInfo}</p>
    </div>
    <div className="text-gray-500 text-md whitespace-nowrap font-semibold">
      Submitted at: {post.created_at}
    </div>
  </div>
);

const JobPostInfo = ({ post }) => (
  <div className="mb-3 text-gray-700 text-sm">
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 items-center font-semibold text-[#828282]">
        <span>{post.agency_name || post.employer_name}</span>
        <span>|</span>
        <span>Location: {post.location}</span>
      </div>
      <div className="flex gap-5 font-semibold text-[#828282]">
        <span>Job Type: {post.job_type}</span>
        <span>Salary: {post.salary_range}</span>
        <span>Required Skill: {post.required_skill}</span>
      </div>
      {post.job_description && (
        <div className="font-semibold text-[#828282]">
          <span>Description: {post.job_description}</span>
        </div>
      )}
    </div>
  </div>
);

const JobPostActions = ({ onViewDetails, onApprove, onReject }) => (
  <div className="flex flex-wrap gap-3 mt-3">
    <button onClick={onApprove} className="bg-green-700 text-white px-10 py-1 hover:bg-green-600 transition-colors cursor-pointer">
      Approve
    </button>
    <button onClick={onReject} className="bg-red-700 text-white px-10 py-1 hover:bg-red-600 transition-colors cursor-pointer">
      Reject
    </button>
    <button onClick={onViewDetails} className="bg-gray-300 px-4 py-1 hover:bg-gray-400 transition-colors cursor-pointer">
      View Details
    </button>
  </div>
);

const ViewDetailsModal = ({ post, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
      <div className="relative backdrop-blur-2xl p-8 shadow-lg w-full max-w-4xl max-h-screen h-[90vh] overflow-y-auto border border-gray-300 max-[991px]:mx-10 max-[426px]:mx-5 max-[321px]:mx-2">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{post.job_title}</h2>
          <button
            onClick={onClose}
            className="mt-5 absolute top-4 right-8 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg mb-2">Job Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Job Title:</span> {post.job_title}</p>
              <p><span className="font-semibold">Posted By:</span> {post.submitted_by}</p>
              <p><span className="font-semibold">Agency/Employer:</span> {post.agency_name || post.employer_name}</p>
              <p><span className="font-semibold">Location:</span> {post.location}</p>
              <p><span className="font-semibold">Job Type:</span> {post.job_type}</p>
              <p><span className="font-semibold">Salary Range:</span> {post.salary_range}</p>
              <p><span className="font-semibold">Required Skills:</span> {post.required_skill}</p>
              <p><span className="font-semibold">Description:</span> {post.job_description}</p>
              {post.number_of_worker != null && (
                <p><span className="font-semibold">Number of Worker(s):</span> {post.number_of_worker}</p>
              )}
              <p><span className="font-semibold">Posted At:</span> {post.created_at}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <p className="text-center text-gray-500 mt-10">No job posts available.</p>
);

const JobPostCard = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const submitterInfo = getSubmitterInfo(post);

  return (
    <>
      <div className="p-6 shadow-md border bg-white border-gray-200 relative">
        <JobPostHeader post={post} submitterInfo={submitterInfo} />
        <hr className="my-2 border-gray-300" />
        <JobPostInfo post={post} />
        <JobPostActions
          onViewDetails={() => setShowModal(true)}
          onApprove={() => setShowApproveModal(true)}
          onReject={() => setShowRejectModal(true)}
        />
      </div>

      <ViewDetailsModal post={post} isOpen={showModal} onClose={() => setShowModal(false)} />
      {showApproveModal && <ApprovedJobPost jobPost={post} onClose={() => setShowApproveModal(false)} />}
      {showRejectModal && <RejectJobPost jobPost={post} onClose={() => setShowRejectModal(false)} />}
    </>
  );
};

const JobPostSection = ({ posts, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="mb-12 flex flex-col min-h-screen">
      <div className="flex flex-col space-y-6 flex-1">
        {currentPosts.length > 0
          ? currentPosts.map((post) => <JobPostCard key={post.job_post_id} post={post} />)
          : <EmptyState />
        }
      </div>
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default function PendingJobPosts() {
  const { data = { hiring: [] } } = usePendingJobPosts();
  const [hiringPage, setHiringPage] = useState(1);

  return (
    <div className="min-h-screen py-6">
      <JobPostSection
        posts={data.hiring}
        currentPage={hiringPage}
        setCurrentPage={setHiringPage}
      />
    </div>
  );
}