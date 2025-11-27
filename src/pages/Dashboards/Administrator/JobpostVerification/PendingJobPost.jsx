import { usePendingJobPosts } from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import { ROLE } from '../../../../../utils/role';
import Pagination from '../../../../components/Pagination';
import icons from '../../../../assets/svg/Icons';
import ApprovedJobPost from './ApprovedJobPost'; // Import the approve modal component
import RejectJobPost from './RejectJobPost'; // Import the reject modal component

// ============================================
// CONSTANTS
// ============================================
const POSTS_PER_PAGE = 4;

const POST_TYPE_BADGES = {
  individual_job_post: { text: "Individual", color: "bg-blue-100 text-blue-800" },
  team_job_post: { text: "Team", color: "bg-yellow-100 text-yellow-800" },
  default: { text: "Hiring", color: "bg-green-100 text-green-800" }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getBadge = (post) => {
  return POST_TYPE_BADGES[post.post_type] || POST_TYPE_BADGES.default;
};

const getSubmitterInfo = (post) => {
  if (post.role === ROLE.MANPOWER_PROVIDER) return `Authorized Person: ${post.submitted_by}`;
  if (post.role === ROLE.BUSINESS_EMPLOYER) return `Business name: ${post.employer_name} | Authorized Person: ${post.authorized_person}`;
  if (post.role === ROLE.INDIVIDUAL_EMPLOYER) return `Authorized Person: ${post.full_name}`;
  if (post.post_type === "individual_job_post") return `Agency: ${post.submitted_by}`;
  if (post.post_type === "team_job_post") return `Agency: ${post.submitted_by}`;
  return '';
};

// ============================================
// SUB-COMPONENTS
// ============================================
const JobPostBadge = ({ badge }) => (
  <div className={`absolute top-35 right-4 px-4 py-1 rounded-full text-sm font-medium ${badge.color}`}>
    {badge.text}
  </div>
);

const JobPostHeader = ({ post, submitterInfo }) => (
  <div className="flex justify-between items-start mb-2">
    <div className='flex flex-col'>
      <h2 className="text-xl font-semibold">{post.job_title || post.worker_category}</h2>
      <p className="text-gray-600 font-medium">{submitterInfo}</p>
    </div>
    <div className="text-gray-500 text-md whitespace-nowrap font-semibold">
      Submitted at: {post.created_at}
    </div>
  </div>
);

const JobPostInfo = ({ post }) => {
  const isIndividual = post.post_type === "individual_job_post";
  const isTeam = post.post_type === "team_job_post";
  const isHiring = !isIndividual && !isTeam;

  return (
    <div className="mb-3 text-gray-700 text-sm">
      {/* HIRING POST - Show all hiring details */}
      {isHiring && (
        <div className='flex flex-col gap-3'>
          <div className='flex gap-3 items-center font-semibold text-[#828282]'>
            <span>{post.agency_name || post.employer_name}</span>
            <span>|</span>
            <span>Location: {post.location}</span>
          </div>
          <div className='flex gap-5 font-semibold text-[#828282]'>
            <span>Job Type: {post.job_type}</span>
            <span>Salary: {post.salary_range}</span>
            <span>Required Skill: {post.required_skill}</span>
          </div>
          {post.job_description && (
            <div className='font-semibold text-[#828282]'>
              <span>Description: {post.job_description}</span>
            </div>
          )}
        </div>
      )}

      {/* INDIVIDUAL POST - Show individual worker details */}
      {isIndividual && (
         <div>
          {<p className='text-xl font-bold'>{post.worker_category}</p>}
          <div className='flex gap-3 justify-start items-center mb-10 font-semibold text-[#828282]'>
            <span>{post.agency_name}</span> |
            <span>{post.years_of_experience} Years of Experience</span>
          </div>
          <div className='flex gap-1 justify-start items-center'>
            <span><img className='w-5 h-5' src={icons.location} alt="location" /></span>
            <p className='mr-10 font-semibold text-[#828282]'>{post.location}</p>
            <span><img className='w-4 h-4' src={icons.posted_clock} alt="posted at" /></span> 
            <p className='font-semibold text-[#828282]'>Posted {post.created_at}</p> 
          </div>
        
        </div>
      )}

      {/* TEAM POST - Show team composition details */}
      {isTeam && (
         <div>
          {<p className='text-xl font-bold'>{post.worker_category}</p>}
          <div className='flex gap-3 justify-start items-center mb-10 font-semibold text-[#828282]'>
            <span>{post.agency_name}</span> |
            <span>{post.years_of_experience} Years of Experience</span>
          </div>
          <div className='flex gap-1 justify-start items-center'>
            <span><img className='w-5 h-5' src={icons.location} alt="location" /></span>
            <p className='mr-10 font-semibold text-[#828282]'>{post.location}</p>
            <span><img className='w-4 h-4' src={icons.posted_clock} alt="posted at" /></span> 
            <p className='font-semibold text-[#828282]'>Posted {post.created_at}</p> 
          </div>
        
        </div>
      )}
    </div>
  );
};

const JobPostActions = ({ onViewDetails, onApprove, onReject }) => (
  <div className="flex flex-wrap gap-3 mt-3">
    <button 
      onClick={onApprove}
      className="bg-green-700 text-white px-10 py-1 hover:bg-green-600 transition-colors">
      Approve
    </button>
    <button 
      onClick={onReject}
      className="bg-red-700 text-white px-10 py-1 hover:bg-red-600 transition-colors">
      Reject
    </button>
    <button 
      onClick={onViewDetails}
      className="bg-gray-300 px-4 py-1 hover:bg-gray-400 transition-colors"
    >
      View Details
    </button>
  </div>
);

const ViewDetailsModal = ({ post, isOpen, onClose }) => {
  if (!isOpen) return null;

  const isIndividual = post.post_type === "individual_job_post";
  const isTeam = post.post_type === "team_job_post";
  const isHiring = !isIndividual && !isTeam;

  return (
      <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
          <div className="relative backdrop-blur-2xl p-8 shadow-lg w-full max-w-4xl max-h-screen h-[90vh] overflow-y-auto border border-gray-300
            max-[991px]:mx-10
            max-[861px]:mx-10
            max-[426px]:mx-5
            max-[321px]:mx-2
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            ">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{post.job_title || post.worker_category}</h2>
         <button
            onClick={onClose}
            className="mt-5 absolute top-4 right-8 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
            >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
        </div>

        <div className="space-y-4">
          {/* HIRING DETAILS */}
          {isHiring && (
            <>
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
                  <p><span className="font-semibold">Posted At:</span> {post.created_at}</p>
                </div>
              </div>
            </>
          )}

          {/* INDIVIDUAL DETAILS */}
          {isIndividual && (
            <>
              <div className="border-b pb-2">
                <h3 className="font-semibold text-lg mb-2">Individual Worker Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Posted by:</span> {post.agency_name}</p>
                  <p><span className="font-semibold">Worker Name:</span> {post.worker_name}</p>
                  <p><span className="font-semibold">Worker Type:</span> {post.worker_category}</p>
                  <p><span className="font-semibold">Years of Experience:</span> {post.years_of_experience} years</p>
                  <p><span className="font-semibold">Location:</span> {post.location}</p>
                  <p><span className="font-semibold">Qualifications:</span> {post.qualifications}</p>
                  {post.skill && <p><span className="font-semibold">Skills/Experience:</span> {post.skill}</p>}
                  <p><span className="font-semibold">Posted At:</span> {post.created_at}</p>
                </div>
              </div>
            </>
          )}

          {/* TEAM DETAILS */}
          {isTeam && (
            <>
              <div className="border-b pb-2">
                <h3 className="font-semibold text-lg mb-2">Team Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Posted By:</span> {post.agency_name}</p>
                  <p><span className="font-semibold">Worker Type:</span> {post.worker_category}</p>
                  <p><span className="font-semibold">Number of Workers Available:</span> {post.number_of_workers}</p>
                  <p><span className="font-semibold">Location:</span> {post.location}</p>
                  
                  <div>
                    <p className="font-semibold mb-1">Team Composition:</p>
                    <div className="ml-4 space-y-1">
                      <p>Senior Workers (8+ years): {post.senior_workers}</p>
                      <p>Mid-Level Workers (5-7 years): {post.mid_level_workers}</p>
                      <p>Junior Workers (2-4 years): {post.junior_workers}</p>
                      <p>Entry-Level Workers (0-1 year): {post.entry_level_workers}</p>
                    </div>
                  </div>
                  
                  <p><span className="font-semibold">Team Skill/Experience:</span> {post.team_skills}</p>
                  <p><span className="font-semibold">Posted At:</span> {post.created_at}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const JobPostCard = ({ post }) => {
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const badge = getBadge(post);
  const submitterInfo = getSubmitterInfo(post);

  return (
    <>
      <div className="p-6 shadow-md border bg-white border-gray-200 relative">
        <JobPostBadge badge={badge} />
        <JobPostHeader post={post} submitterInfo={submitterInfo} />
        <hr className="my-2 border-gray-300" />
        <JobPostInfo post={post} />
        <JobPostActions 
          onViewDetails={() => setShowModal(true)} 
          onApprove={() => setShowApproveModal(true)}
          onReject={() => setShowRejectModal(true)}
        />
      </div>
      
      <ViewDetailsModal 
        post={post} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {showApproveModal && (
        <ApprovedJobPost
          jobPost={post}
          onClose={() => setShowApproveModal(false)}
        />
      )}

      {showRejectModal && (
        <RejectJobPost
          jobPost={post}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </>
  );
};

const EmptyState = ({ message = "No job posts available." }) => (
  <p className="text-center text-gray-500 mt-10">{message}</p>
);

const JobPostSection = ({ title, posts, currentPage, setCurrentPage, badgeColor }) => {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${badgeColor} inline-block px-4 py-2 rounded`}>
          {title}
        </h2>
        <span className="ml-3 text-gray-600 font-medium">({posts.length} total)</span>
      </div>

      <div className="flex flex-col space-y-6">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <JobPostCard key={post.job_post_id} post={post} />
          ))
        ) : (
          <EmptyState message={`No ${title.toLowerCase()} available.`} />
        )}
      </div>

      {posts.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function PendingJobPosts() {
  const { data = { hiring: [], individual: [], team: [] } } = usePendingJobPosts();
  
  const [hiringPage, setHiringPage] = useState(1);
  const [individualPage, setIndividualPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);

  return (
    <div className="min-h-screen py-6">
      <JobPostSection
        title="Hiring Posts"
        posts={data.hiring}
        currentPage={hiringPage}
        setCurrentPage={setHiringPage}
        badgeColor="bg-green-100 text-green-800"
      />

      <JobPostSection
        title="Individual Posts"
        posts={data.individual}
        currentPage={individualPage}
        setCurrentPage={setIndividualPage}
        badgeColor="bg-blue-100 text-blue-800"
      />

      <JobPostSection
        title="Team Posts"
        posts={data.team}
        currentPage={teamPage}
        setCurrentPage={setTeamPage}
        badgeColor="bg-yellow-100 text-yellow-800"
      />
    </div>
  );
}