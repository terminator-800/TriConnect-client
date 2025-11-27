import { useEmployerDashboard } from '../../../../hooks/useEmployerDashboard'
import { ROLE } from '../../../../utils/role'
import Sidebar from './Sidebar'

const JobPostDetails = () => {
  const { data, isLoading, error } = useEmployerDashboard(ROLE.INDIVIDUAL_EMPLOYER);
  const recentJobPosts = data?.recentJobPosts || [];
  const recentApplicants = data?.recentApplicants || [];
  return (
    <>
    <Sidebar/>
    <div className="relative min-h-[140vh] bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
      <div className="bg-white shadow-md py-6 px-10 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Welcome, Employer!</h1>
            <p>Your hiring platform statistics at a glance</p>
          </div>
      </div>
      
      {/* Recent Job Posts */}
      <div className="w-full rounded mt-15">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Job Posts</h2>
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">+ Job Post</button>
        </div>

        <div className="rounded-2xl shadow border border-gray-300 overflow-hidden">

          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-300 px-4 py-3 rounded-t border border-gray-300">
                <th className="text-left py-3 px-4 font-semibold">Job Title</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Date Posted</th>
                <th className="text-left py-3 px-4 font-semibold">Applicants</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={5} className="py-6 text-center text-gray-500">Loading...</td></tr>
              )}
              {!isLoading && recentJobPosts.length === 0 && (
                <tr><td colSpan={5} className="py-6 bg-white text-center text-gray-500 italic">No recent job posts.</td></tr>
              )}
              {!isLoading && recentJobPosts.map((p) => (
                <tr key={p.job_post_id} className="border-b border-gray-200 bg-white text-[#2C3E50]">
                  <td className="py-3 px-4">{p.job_title}</td>
                  <td className="py-3 px-4">{p.job_type}</td>
                  <td className="py-3 px-4">{p.created_at_formatted}</td>
                  <td className="py-3 px-4">{p.applicant_count}</td>
                  <td className="py-3 px-4">
                    {p.jobpost_status === 'active' && (
                      <span className="bg-blue-900 text-white text-sm px-4 py-1 rounded">Active</span>
                    )}
                    {p.jobpost_status === 'paused' && (
                      <span className="bg-gray-600 text-white text-sm px-4 py-1 rounded">Paused</span>
                    )}
                    {p.jobpost_status === 'completed' && (
                      <span className="bg-green-600 text-white text-sm px-4 py-1 rounded">Completed</span>
                    )}
                    {(!p.jobpost_status || p.jobpost_status === 'pending') && (
                      <span className="bg-gray-500 text-white text-sm px-4 py-1 rounded">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && (
            <div className="px-4 py-3 text-red-600 text-sm border-t border-gray-200">Failed to load dashboard</div>
          )}
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="w-full rounded mt-15">

        <h2 className="text-2xl font-semibold mb-4">Recent Applicants</h2>

        <div className="rounded-2xl shadow border border-gray-300 overflow-hidden">

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 ">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Job Position</th>
                <th className="text-left py-3 px-4 font-semibold">Location</th>
                <th className="text-left py-3 px-4 font-semibold">Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">Loading...</td></tr>
              )}
              {!isLoading && recentApplicants.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500 italic bg-white">No recent applicants.</td></tr>
              )}
              {!isLoading && recentApplicants.map((a) => (
                <tr key={a.application_id} className="border-b border-gray-200 bg-white text-[#2C3E50]">
                  <td className="py-3 px-4 ">{a.applicant_name}</td>
                  <td className="py-3 px-4">{a.job_title}</td>
                  <td className="py-3 px-4">{a.location || '-'}</td>
                  <td className="py-3 px-4">{a.applied_at_formatted || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}

export default JobPostDetails