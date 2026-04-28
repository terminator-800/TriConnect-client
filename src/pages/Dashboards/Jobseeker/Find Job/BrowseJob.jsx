import {
  useSaveJobPost,
  useSavedJobPosts,
  useUnappliedJobPosts,
  useUnsaveJobPost,
} from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import Pagination from '../../../../components/Pagination';
import icons from '../../../../assets/svg/Icons';
import Apply from './Apply';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import DisabledAccount from '../../../../components/DisabledAccount';
import VerificationStatus from '../Verification Form/VerificationStatus';
import Form from '../Verification Form/Form';
import { MagnifyingGlass } from '../../../../assets/icon2/icon2';

const BrowseJob = () => {
  const unknown = 'Unknown';
  const postsPerPage = 4;
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    data: profileData,
    isLoading: loadingProfile,
    isError: errorProfile,
    refetch,
  } = useUserProfile(ROLE.JOBSEEKER);

  const {
    data: filteredJobPosts = [],
    isLoading: loadingJobPosts,
    isError: errorJobPosts,
  } = useUnappliedJobPosts();
  const { data: savedJobPosts = [] } = useSavedJobPosts();
  const saveJobMutation = useSaveJobPost();
  const unsaveJobMutation = useUnsaveJobPost();

  const savedJobPostIds = new Set(savedJobPosts.map((post) => post.job_post_id));

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredJobPosts.slice(startIndex, startIndex + postsPerPage);
  const openForm = () => setShowForm(true);
  const isSelectedJobSaved = selectedJobPost
    ? savedJobPostIds.has(selectedJobPost.job_post_id)
    : false;

  const handleToggleSavedJob = async () => {
    if (!selectedJobPost?.job_post_id) return;
    const jobPostId = selectedJobPost.job_post_id;

    if (isSelectedJobSaved) {
      await unsaveJobMutation.mutateAsync(jobPostId);
      return;
    }

    await saveJobMutation.mutateAsync(jobPostId);
  };

  if (profileData.is_verified && profileData.employment_status === 'hired') {
    return (
      <div className='px-5'>
        <DisabledAccount
          contractData={{
            employer: profileData.employer_name,
            job_title: profileData.job_title,
            start_date: profileData.contract_start_date,
            end_date: profileData.contract_end_date,
          }}
        />
      </div>
    );
  }

  // Show verification status if not verified
  if (!profileData.is_verified) {
    return (
      <div className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 md:pl-70 pr-4 md:pr-10 pt-10 md:pt-30">
        <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-4 md:px-20">
          <VerificationStatus profileData={profileData} openForm={openForm} />
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
    );
  }

  return (
    <>
      <div className="bg-white shadow-md py-6 px-4 md:px-10 mb-8 flex 2xl:flex-row lg:flex-col md:flex-col sm:flex-col max-[635px]:flex-col gap-4 ">
        {/* Title & description */}
        <div className="flex flex-col flex-1 justify-center">
          <h1 className="text-2xl font-bold text-[#2563EB]">Browse Job</h1>
          <p>Browse job openings and apply to positions that fit you</p>
        </div>

        {/* Search Bar */}
      <div className="flex-1 flex items-center gap-2 flex-wrap sm:flex-nowrap bg-[#C8E9FF] shadow-md pl-3 pr-3 py-2 sm:px-5 sm:py-2 md:px-5 md:py-3 lg:px-5 2xl:pr-3">
        <MagnifyingGlass className="w-5 h-5 md:w-6 md:h-6 text-[#2563EB] shrink-0" />
        <input type="text" placeholder="Search job titles" className="flex-1 min-w-0 outline-none bg-transparent text-[#2563EB] text-sm md:text-base" />
        <button className="bg-[#2563EB] text-white text-sm md:text-base px-4 sm:px-6 md:px-10 py-1 whitespace-nowrap cursor-pointer w-full sm:w-auto">Find jobs</button>
      </div>

      </div>
      {/* MAIN CONTENT */}
      <div className="flex flex-col h-screen">
        <div className="overflow-y-auto space-y-10 w-full">
          {loadingJobPosts ? (
            <p>Loading jobs...</p>
          ) : errorJobPosts ? (
            <p className="text-red-500">Failed to fetch job posts.</p>
          ) : filteredJobPosts.length === 0 ? (
            <p className="text-gray-500 italic">No approved job posts available.</p>
          ) : (
            // Side with job posts
            paginatedPosts.map((post) => (
              <div
                key={post.job_post_id}
                onClick={() => setSelectedJobPost(post)}
                className={`border border-gray-300 py-5 px-4 md:px-5 shadow-md cursor-pointer overflow-hidden w-full min-h-[20vh] flex flex-col justify-between
                ${
                  selectedJobPost?.job_post_id === post.job_post_id
                    ? 'bg-gray-200'
                    : 'bg-white hover:bg-gray-100'
                }
                `}
              >
                {/* Hide Scrollbar */}
                <style>{`div::-webkit-scrollbar { display: none }`}</style>

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg md:text-xl font-bold truncate">{post.job_title}</h3>
                  <p className="text-gray-500 truncate text-sm md:text-base">
                    {post.business_name || post.full_name || post.agency_name || unknown}
                  </p>
                  <span className="bg-blue-200 text-blue-700 rounded-full px-6 md:px-10 py-1 mt-2 text-xs md:text-sm w-max">
                    {post.job_type}
                  </span>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-5 text-gray-500 text-xs md:text-sm">
                  {/* Location */}
                  <div className="flex items-center gap-1 truncate max-w-full">
                    <img src={icons.location} alt="Location" className="w-4 h-4 shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center gap-1 truncate max-w-full">
                    <img src={icons.posted_clock} alt="Posted" className="w-4 h-4 shrink-0" />
                    <span className="truncate">Posted: {post.approved_at}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedJobPost && (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 2xl:ml-55 px-4 sm:px-6 md:px-8 lg:px-12"
            onClick={() => setSelectedJobPost(null)}
          >
            <div
              className="w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl relative backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJobPost(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-7 h-7 hover:bg-red-700 cursor-pointer z-10"
              >
                ✕
              </button>

              {/* Content */}
              <div className="p-4 md:p-8">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {selectedJobPost.job_title}
                    </h1>
                    <span className="bg-white text-[#1E40AF] px-3 py-1 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm md:text-base">
                    <p className="text-gray-600">
                      {selectedJobPost.business_name ||
                        selectedJobPost.full_name ||
                        selectedJobPost.agency_name ||
                        unknown}
                    </p>
                    <span className="hidden sm:inline">|</span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>
                        <img src={icons.posted_clock} alt="" className="w-4 h-4" />
                      </span>
                      <span>Posted {selectedJobPost.approved_at}</span>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Job Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.job_type} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Job Type</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">{selectedJobPost.job_type}</p>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.location_blue} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Location</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6 break-words">{selectedJobPost.location}</p>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.salary_range} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Salary Range</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">
                        {selectedJobPost.salary_range}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Required Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span>
                        <img src={icons.required_skills} alt="" className="w-4 h-4" />
                      </span>
                      <label className="text-gray-600 text-sm">Required Skills</label>
                    </div>
                    <ul className="ml-6 space-y-2">
                      {selectedJobPost.required_skill &&
                        selectedJobPost.required_skill
                          .split('\n')
                          .filter((skill) => skill.trim())
                          .map((skill, idx) => (
                            <li key={idx} className="cursor-pointer text-sm text-gray-900 break-words">
                              {skill.trim()}
                            </li>
                          ))}
                    </ul>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                  <label className="text-gray-700 font-semibold text-sm block mb-3">
                    Job Description
                  </label>
                  <textarea
                    readOnly
                    value={selectedJobPost.job_description}
                    className="w-full p-4 backdrop-blur-2xl text-sm resize-none outline-none border border-[#6B7280]"
                    rows={6}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">

                  {/* APPLY NOW */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className=" bg-blue-600 text-white cursor-pointer font-semibold px-6 md:px-10 py-2 md:py-1 hover:bg-blue-700 transition text-sm md:text-base"
                  >
                    Apply Now
                  </button>
                  
                  {/* SAVE JOB */}
                  <button
                    onClick={handleToggleSavedJob}
                    disabled={saveJobMutation.isPending || unsaveJobMutation.isPending}
                    className=" bg-[#6B7280] text-white cursor-pointer font-semibold px-6 md:px-10 py-2 md:py-1 hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saveJobMutation.isPending || unsaveJobMutation.isPending
                      ? 'Saving...'
                      : isSelectedJobSaved
                      ? 'Unsave Job'
                      : 'Save Job'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-5 pb-10">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredJobPosts.length / postsPerPage)}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {isModalOpen && selectedJobPost && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 px-4 md:px-0">
          <Apply
            employer={selectedJobPost}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedJobPost(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default BrowseJob;