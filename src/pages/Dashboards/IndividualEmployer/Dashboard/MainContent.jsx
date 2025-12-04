import React from 'react';
import { useEmployerDashboard } from '../../../../../hooks/useEmployerDashboard';
import { ROLE } from '../../../../../utils/role';

const MainContent = () => {
  const { data = {}, isPending, error } = useEmployerDashboard(ROLE.INDIVIDUAL_EMPLOYER);

  const statsData = data.stats || {};
  const jobPosts = data.recentJobPosts || [];
  const applicants = data.recentApplicants || [];

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {' '}
          {error.message || 'Failed to load dashboard data.'}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Stats (non-map version) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-left">
        <div className="bg-white shadow p-6  hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500 mb-2">TOTAL APPLICANTS</h3>
          <p className="text-3xl font-bold text-gray-800">{statsData.totalApplicants || 0}</p>
        </div>
        <div className="bg-white shadow p-6  hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500 mb-2">APPLIED</h3>
          <p className="text-3xl font-bold text-blue-600">{statsData.applied || 0}</p>
        </div>
        <div className="bg-white shadow p-6  hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500 mb-2">HIRED</h3>
          <p className="text-3xl font-bold text-green-600">{statsData.hired || 0}</p>
        </div>
        <div className="bg-white shadow p-6  hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500 mb-2">REJECTED</h3>
          <p className="text-3xl font-bold text-red-600">{statsData.rejected || 0}</p>
        </div>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Job Posts */}
        <div className="bg-white shadow overflow-hidden px-10">
          <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Job Posts</h2>
          <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                <tr>
                  <th className="p-3 font-semibold">Job Title</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Date Posted</th>
                  <th className="p-3 font-semibold">Applicants</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.length > 0 ? (
                  jobPosts.map((job) => (
                    <tr
                      key={job.job_post_id}
                      className=" hover:bg-gray-100 border-b border-[#E5E7EB] text-[#1F2937]"
                    >
                      <td className="p-3">{job.job_title}</td>
                      <td className="p-3">{job.job_type}</td>
                      <td className="p-3">{job.created_at_formatted}</td>
                      <td className="p-3">{job.applicant_count}</td>
                      <td className="p-3 text-blue-600 font-medium cursor-pointer">
                        {job.jobpost_status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No recent job posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white shadow overflow-hidden px-10">
          <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Applicants</h2>
          <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                <tr>
                  <th className="p-3 font-semibold">Applicant Name</th>
                  <th className="p-3 font-semibold">Job Position</th>
                  <th className="p-3 font-semibold">Location</th>
                  <th className="p-3 font-semibold">Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length > 0 ? (
                  applicants.map((app) => (
                    <tr
                      key={app.application_id}
                      className="border-b border-[#E5E7EB] hover:bg-gray-100 text-[#1F2937]"
                    >
                      <td className="p-3">{app.applicant_name}</td>
                      <td className="p-3">{app.job_title}</td>
                      <td className="p-3">{app.location}</td>
                      <td className="p-3">{app.applied_at_formatted}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No recent applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
