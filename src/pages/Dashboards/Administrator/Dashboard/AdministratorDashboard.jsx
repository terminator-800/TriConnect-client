import Sidebar from '../Sidebar';
import BarChart from './BarChart';
import { useFetchChartData } from './chartData';
import { useFetchSuccessfulHires } from './useFetchSuccessfulHires';
import { useFetchEnrolledEmployers } from './useFetchEnrolledEmployers';

const Dashboard = () => {
  const { data } = useFetchChartData();
  const { data: hires, isLoading: hiresLoading } = useFetchSuccessfulHires();
  const { data: employers, isLoading: employersLoading } = useFetchEnrolledEmployers();

  return (
    <>
      <Sidebar />
      <div
        className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-[#00C2CB]
                pl-70 pr-10 pt-30
                "
      >
        <div>
          <h1 className="text-2xl font-bold text-[#2563EB]">Admin Dashboard</h1>
          <p className="mt-2 text-gray-700">
            Gain insights into job post trends, user engagement, and overall platform growth.
          </p>

          {/* Cards */}
          <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start">
            {/* Card Template */}
            {[
              { title: 'Total Job Seekers', value: data?.summary?.totalJobseekersYear || 0 },
              { title: 'Total Employers', value: data?.summary?.totalEmployersYear || 0 },
              { title: 'Total Agencies', value: data?.summary?.totalAgenciesYear || 0 },
              { title: 'Hired Job Seekers', value: data?.summary?.totalHiredYear || 0 },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white shadow-md rounded-lg 
                           flex flex-col justify-center items-center 
                           flex-1 min-w-[200px] max-w-[250px] h-32"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="bg-white p-5 rounded-lg mt-8 mb-10">
            <BarChart />
          </div>

           {/* Two Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
            {/* Recent Successful Hires */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Successful Hires</h2>
              <div className="overflow-auto max-h-80">
                {hiresLoading ? (
                  <p className="text-center text-gray-500 py-4">Loading hires...</p>
                ) : hires && hires.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Company</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Position</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hires.map((hire, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-800">{hire.name}</td>
                          <td className="p-3 text-sm text-gray-600">{hire.company}</td>
                          <td className="p-3 text-sm text-gray-600">{hire.position}</td>
                          <td className="p-3 text-sm text-gray-600">{hire.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 py-4">No successful hires yet</p>
                )}
              </div>
            </div>

            {/* Enrolled Agencies/Businesses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Enrolled Agencies/Businesses</h2>
              <div className="overflow-auto max-h-80">
                {employersLoading ? (
                  <p className="text-center text-gray-500 py-4">Loading employers...</p>
                ) : employers && employers.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Company Name</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Active Jobs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employers.map((company, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-800">{company.name}</td>
                          <td className="p-3 text-sm text-gray-600">{company.type}</td>
                          <td className="p-3 text-sm">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {company.active_jobs}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 py-4">No enrolled employers yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;