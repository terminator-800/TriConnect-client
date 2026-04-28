import { useState } from 'react';
import Sidebar from '../Sidebar';
import Pagination from '../../../../components/Pagination';
import icons from '../../../../assets/svg/Icons';
import Apply from '../Find Job/Apply';
import { useSavedJobPosts, useUnsaveJobPost } from '../../../../../hooks/useJobposts';

const SavedJob = () => {
  const unknown = 'Unknown';
  const postsPerPage = 4;
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const unsaveJobMutation = useUnsaveJobPost();

  const {
    data: savedJobPosts = [],
    isLoading: loadingSavedJobPosts,
    isError: errorSavedJobPosts,
  } = useSavedJobPosts();

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = savedJobPosts.slice(startIndex, startIndex + postsPerPage);

  const handleUnsave = async (jobPostId) => {
    await unsaveJobMutation.mutateAsync(jobPostId);
    if (selectedJobPost?.job_post_id === jobPostId) {
      setSelectedJobPost(null);
    }
  };

  return (
    <>
      <Sidebar />
      <div
        className="relative min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-4 pr-4 pt-30 
          sm:pl-auto md:px-auto lg:pl-70 sm:pr-6 md:pr-8 lg:px-auto sm:pt-20 md:pt-30 sm:mt-0"
      >
        <div className="bg-white shadow-md py-6 px-4 md:px-10 mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#2563EB]">Saved Job Posts</h1>
          <p>Review the jobs you have saved and apply when you are ready.</p>
        </div>

        <div className="flex flex-col min-h-[65vh]">
          <div className="overflow-y-auto space-y-10 w-full">
            {loadingSavedJobPosts ? (
              <p>Loading saved jobs...</p>
            ) : errorSavedJobPosts ? (
              <p className="text-red-500">Failed to fetch saved job posts.</p>
            ) : savedJobPosts.length === 0 ? (
              <p className="text-gray-500 italic">No saved job posts yet.</p>
            ) : (
              paginatedPosts.map((post) => (
                <div
                  key={post.job_post_id}
                  onClick={() => setSelectedJobPost(post)}
                  className={`border border-gray-300 py-5 px-4 md:px-5 shadow-md cursor-pointer overflow-hidden w-full min-h-[20vh] flex flex-col justify-between
                  ${
                    selectedJobPost?.job_post_id === post.job_post_id
                      ? 'bg-gray-200'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg md:text-xl font-bold truncate">{post.job_title}</h3>
                    <p className="text-gray-500 truncate text-sm md:text-base">
                      {post.business_name || post.full_name || post.agency_name || unknown}
                    </p>
                    <span className="bg-blue-200 text-blue-700 rounded-full px-6 md:px-10 py-1 mt-2 text-xs md:text-sm w-max">
                      {post.job_type}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mt-5 text-gray-500 text-xs md:text-sm">
                    <div className="flex items-center gap-1 truncate max-w-full">
                      <img src={icons.location} alt="Location" className="w-4 h-4 shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate max-w-full">
                      <img src={icons.posted_clock} alt="Posted" className="w-4 h-4 shrink-0" />
                      <span className="truncate">Saved: {post.saved_at}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center mt-5 pb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(savedJobPosts.length / postsPerPage))}
            setCurrentPage={setCurrentPage}
          />
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
              <button
                onClick={() => setSelectedJobPost(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-7 h-7 hover:bg-red-700 cursor-pointer z-10"
              >
                ✕
              </button>

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.job_type} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Job Type</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">{selectedJobPost.job_type}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.location_blue} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Location</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6 break-words">
                        {selectedJobPost.location}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.salary_range} alt="" className="w-4 h-4" />
                        </span>
                        <label className="text-gray-600 text-sm">Salary Range</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">{selectedJobPost.salary_range}</p>
                    </div>
                  </div>

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
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="bg-blue-600 text-white cursor-pointer font-semibold px-6 md:px-10 py-2 md:py-1 hover:bg-blue-700 transition text-sm md:text-base"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => handleUnsave(selectedJobPost.job_post_id)}
                    disabled={unsaveJobMutation.isPending}
                    className="bg-[#6B7280] text-white cursor-pointer font-semibold px-6 md:px-10 py-2 md:py-1 hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {unsaveJobMutation.isPending ? 'Removing...' : 'Unsave Job'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isApplyModalOpen && selectedJobPost && (
          <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 px-4 md:px-0">
            <Apply
              employer={selectedJobPost}
              onClose={() => {
                setIsApplyModalOpen(false);
                setSelectedJobPost(null);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SavedJob;
