import { useUnappliedJobPosts } from '../../../../../hooks/useJobposts';
import { useState } from 'react';
import Pagination from '../../../../components/Pagination';
import icons from '../../../../assets/svg/Icons';
import Apply from './Apply';
import { useUserProfile } from '../../../../../hooks/useUserProfiles';
import { ROLE } from '../../../../../utils/role';
import DisabledAccount from '../../../../components/DisabledAccount';
import VerificationStatus from '../Verification Form/VerificationStatus';
import Form from '../Verification Form/Form';

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

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredJobPosts.slice(startIndex, startIndex + postsPerPage);
  const openForm = () => setShowForm(true);

  if (profileData.is_verified && profileData.employment_status === 'hired') {
    return (
      <DisabledAccount
        contractData={{
          employer: profileData.employer_name,
          job_title: profileData.job_title,
          start_date: profileData.contract_start_date,
          end_date: profileData.contract_end_date,
        }}
      />
    );
  }

  // Show verification status if not verified
  if (!profileData.is_verified) {
    return (
      <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md p-6 w-full border border-gray-300 px-20">
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
      <div className="bg-white shadow-md py-6 px-10 mb-8 flex flex-col md:flex-row gap-4">
        {/* Title & description */}
        <div className="flex flex-col flex-1 justify-center">
          <h1 className="text-2xl font-bold text-blue-900">Browse Job</h1>
          <p>Browse job openings and apply to positions that fit you</p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 text-white pl-5 pr-5 shadow-md flex items-center gap-2 bg-[#BDC3C7]">
          <img src={icons.search_job_icon} alt="search jobs" />
          <input type="text" placeholder="Search job titles" className="outline-none flex-1 " />
          <button className="text-white bg-[#2563EB] rounded-xl px-10 py-1 cursor-pointer">
            Find jobs
          </button>
        </div>
      </div>

      {/* Search Bar */}

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
                className={`border border-gray-300 py-5 px-5 shadow-md cursor-pointer overflow-hidden w-full min-h-[20vh] flex flex-col justify-between
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
                  <h3 className="text-xl font-bold truncate">{post.job_title}</h3>
                  <p className="text-gray-500 truncate">
                    {post.business_name || post.full_name || post.agency_name || unknown}
                  </p>
                  <span className="bg-blue-200 text-blue-700 rounded-full px-10 py-1 mt-2 text-sm w-max">
                    {post.job_type}
                  </span>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center gap-6 mt-5 text-gray-500 text-sm">
                  {/* Location */}
                  <div className="flex items-center gap-1 truncate">
                    <img src={icons.location} alt="Location" className="w-4 h-4" />
                    <span className="truncate">{post.location}</span>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center gap-1 truncate">
                    <img src={icons.posted_clock} alt="Posted" className="w-4 h-4" />
                    <span className="truncate">Posted: {post.approved_at}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedJobPost && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50 ml-55"
            onClick={() => setSelectedJobPost(null)}
          >
            <div
              className="w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl relative backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJobPost(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-7 h-7 hover:bg-red-700 cursor-pointer"
              >
                ✕
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Header - Job Title and Status */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {selectedJobPost.job_title}
                    </h1>
                    <span className="bg-white text-[#1E40AF] px-3 py-1 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <p className="text-gray-600 text-sm">
                      {selectedJobPost.business_name ||
                        selectedJobPost.full_name ||
                        selectedJobPost.agency_name ||
                        unknown}
                    </p>
                    <span>|</span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <span>
                        <img src={icons.posted_clock} alt="" />
                      </span>
                      <span>Posted {selectedJobPost.approved_at}</span>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Job Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.job_type} alt="" />
                        </span>
                        <label className="text-gray-600 text-sm">Job Type</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">{selectedJobPost.job_type}</p>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.location_blue} alt="" />
                        </span>
                        <label className="text-gray-600 text-sm">Location</label>
                      </div>
                      <p className="text-gray-900 font-semibold ml-6">{selectedJobPost.location}</p>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          <img src={icons.salary_range} alt="" />
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
                        <img src={icons.required_skills} alt="" />
                      </span>
                      <label className="text-gray-600 text-sm">Required Skills</label>
                    </div>
                    <ul className="ml-6 space-y-2">
                      {selectedJobPost.required_skill &&
                        selectedJobPost.required_skill
                          .split('\n')
                          .filter((skill) => skill.trim())
                          .map((skill, idx) => (
                            <li key={idx} className="cursor-pointer text-sm text-gray-900">
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

                {/* Action Buttons */}
                <div className="">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-blue-600 text-white cursor-pointer font-semibold px-10 py-1 hover:bg-blue-700 transition mr-10"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex-1 bg-transparent text-gray-800 cursor-pointer font-semibold px-10 py-1 border hover:bg-gray-50 transition"
                  >
                    Save Job
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
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
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
