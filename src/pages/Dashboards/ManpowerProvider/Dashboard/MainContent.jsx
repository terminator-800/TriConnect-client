import React from 'react';
import { useManPowerProvider } from '../../../../../hooks/useManPowerProvider';
import { ROLE } from '../../../../../utils/role';

const MainContent = () => {
  const { data = null } = useManPowerProvider(ROLE.MANPOWER_PROVIDER);

  const stats = data?.stats
    ? [
        { label: 'TOTAL MEMBERS', value: data.stats.totalMembers, color: 'text-gray-800' },
        { label: 'AVAILABLE', value: data.stats.available, color: 'text-blue-600' },
        // { label: 'DEPLOYED', value: data.stats.deployed, color: 'text-green-600' },
        { label: 'DEPLOYED', value: 0, color: 'text-green-600' },
        { label: 'COMPLETED', value: data.stats.completed, color: 'text-orange-600' },
      ]
    : [];

  const jobPosts = data?.recentPosts || [];
  const requests = data?.recentRequests || [];

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-left">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow p-6 hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white shadow overflow-hidden px-10">
          <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Posts</h2>
          {jobPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-1">No Recent Posts</p>
              <p className="text-gray-400 text-sm">Posts you create will appear here</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                  <tr>
                    <th className="p-3 font-semibold">Job Title / Category</th>
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Date Posted</th>
                    <th className="p-3 font-semibold">Applicants / Requests</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPosts.map((job, i) => (
                    <tr
                      key={i}
                      className=" hover:bg-gray-100 border-b border-[#E5E7EB] text-[#1F2937]"
                    >
                      <td className="p-3">{job.job_title}</td>
                      <td className="p-3">{job.post_type}</td>
                      <td className="p-3">{job.date_posted}</td>
                      <td className="p-3">{job.applicant_count}</td>
                      <td className="p-3 text-blue-600 font-medium cursor-pointer capitalize">
                        {job.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="bg-white shadow overflow-hidden px-10">
          <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Requests</h2>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-1">No Recent Requests</p>
              <p className="text-gray-400 text-sm">Employer requests will appear here</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                  <tr>
                    <th className="p-3 font-semibold">Employer Name</th>
                    <th className="p-3 font-semibold">Job Category</th>
                    <th className="p-3 font-semibold">No. of Workers</th>
                    <th className="p-3 font-semibold">Location</th>
                    <th className="p-3 font-semibold">Request Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#E5E7EB] hover:bg-gray-100 text-[#1F2937]"
                    >
                      <td className="p-3">{req.employerName}</td>
                      <td className="p-3">{req.jobCategory}</td>
                      <td className="p-3">{req.workers}</td>
                      <td className="p-3">{req.location}</td>
                      <td className="p-3">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainContent;
