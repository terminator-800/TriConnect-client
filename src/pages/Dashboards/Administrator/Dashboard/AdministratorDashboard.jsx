import Sidebar from '../Sidebar';
import BarChart from './BarChart';
import { useMemo, useState } from 'react';
import { useFetchChartDataByPeriod } from './chartData';
import { useFetchSuccessfulHires } from './useFetchSuccessfulHires';
import { useFetchEnrolledEmployers } from './useFetchEnrolledEmployers';
import { generateAdminDashboardReportHtml } from './AdminDashboardExportReport';
import {
  JobseekerAdminDashboardIcon,
  EmployerAdminDashboardIcon,
  AgenciesAdminDashboardIcon,
  HiringSuccessRateAdminDashboardIcon,
} from '../../../../assets/icon2/icon2';

const Dashboard = () => {
  const [timeView, setTimeView] = useState('Daily');
  const periodMap = { Daily: 'daily', Weekly: 'weekly', Monthly: 'monthly' };
  const selectedPeriod = periodMap[timeView] || 'daily';
  const { data, isLoading: chartLoading, error: chartError } = useFetchChartDataByPeriod(selectedPeriod);
  const { data: hires, isLoading: hiresLoading } = useFetchSuccessfulHires();
  const { data: employers, isLoading: employersLoading } = useFetchEnrolledEmployers();

  const formatTrend = (value) => {
    const num = Number(value || 0);
    if (num > 0) return `+${num}% vs previous`;
    if (num < 0) return `${num}% vs previous`;
    return '0% vs previous';
  };

  const summaryCards = useMemo(() => {
    const jobseekers = Number(data?.summary?.totalJobseekers || 0);
    const employersCount = Number(data?.summary?.totalEmployers || 0);
    const agencies = Number(data?.summary?.totalAgencies || 0);
    const hireRate = Number(data?.summary?.hireSuccessRate || 0).toFixed(1);
    const jobseekersTrend = formatTrend(data?.summary?.jobseekersChangePct);
    const employersTrend = formatTrend(data?.summary?.employersChangePct);
    const agenciesTrend = formatTrend(data?.summary?.agenciesChangePct);
    const hireRateTrend = formatTrend(data?.summary?.hireSuccessRateChangePct);

    return [
      {
        title: 'JOB SEEKERS',
        value: jobseekers,
        note: jobseekersTrend,
        stripe: 'border-l-[#1D4ED8]',
        noteColor: Number(data?.summary?.jobseekersChangePct || 0) >= 0 ? 'text-[#16A34A]' : 'text-red-600',
        icon: <JobseekerAdminDashboardIcon size={30} className="opacity-90" />,
      },
      {
        title: 'EMPLOYERS',
        value: employersCount,
        note: employersTrend,
        stripe: 'border-l-[#22C55E]',
        noteColor: Number(data?.summary?.employersChangePct || 0) >= 0 ? 'text-[#16A34A]' : 'text-red-600',
        icon: <EmployerAdminDashboardIcon size={30} className="opacity-90" />,
      },
      {
        title: 'AGENCIES',
        value: agencies,
        note: agenciesTrend,
        stripe: 'border-l-[#F59E0B]',
        noteColor: Number(data?.summary?.agenciesChangePct || 0) >= 0 ? 'text-[#16A34A]' : 'text-red-600',
        icon: <AgenciesAdminDashboardIcon size={30} className="opacity-90" />,
      },
      {
        title: 'HIRING SUCCESS RATE',
        value: `${hireRate}%`,
        note: hireRateTrend,
        stripe: 'border-l-[#8B5CF6]',
        noteColor:
          Number(data?.summary?.hireSuccessRateChangePct || 0) >= 0 ? 'text-[#16A34A]' : 'text-red-600',
        icon: <HiringSuccessRateAdminDashboardIcon size={30} className="opacity-90" />,
      },
    ];
  }, [data]);

  const handleExport = () => {
    const reportDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const printWindow = window.open('', '_blank', 'width=1024,height=900');
    if (!printWindow) return;

    const reportHtml = generateAdminDashboardReportHtml({
      reportDate,
      period: timeView,
      summary: {
        jobseekers: data?.summary?.totalJobseekers || 0,
        employers: data?.summary?.totalEmployers || 0,
        agencies: data?.summary?.totalAgencies || 0,
        jobseekersChangePct: data?.summary?.jobseekersChangePct || 0,
        employersChangePct: data?.summary?.employersChangePct || 0,
        agenciesChangePct: data?.summary?.agenciesChangePct || 0,
        hireSuccessRateChangePct: data?.summary?.hireSuccessRateChangePct || 0,
      },
      hireRate: Number(data?.summary?.hireSuccessRate || 0).toFixed(1),
      hires,
      employers,
    });

    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    // Some browsers need onload before printing, otherwise preview becomes blank.
    printWindow.onload = triggerPrint;
    setTimeout(triggerPrint, 350);
  };

  return (
    <>
      <Sidebar />
      <div
        className="min-h-screen bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-22 pb-10"
      >
        <div className="py-7">
          <div className="bg-white shadow-md py-6 px-10 mb-8">
            <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#2563EB]">Admin Dashboard</h1>
                <p className="text-gray-700">
                  Gain insights into job post trends, user engagement, and overall platform growth.
                </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeView}
                onChange={(e) => setTimeView(e.target.value)}
                className="border border-gray-300 bg-gray-600 text-white text-sm px-3 py-2 min-w-[105px] cursor-pointer"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <button
                type="button"
                onClick={handleExport}
                className="bg-[#1D4ED8] text-white text-sm px-8 py-2 cursor-pointer"
              >
                Export
              </button>
            </div>
          </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className={`bg-white border-l-4 ${card.stripe} px-5 py-4 min-h-[110px]`}
              >
                <h3 className="text-sm font-semibold text-gray-600">{card.title}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  {card.icon ? <div className="shrink-0">{card.icon}</div> : null}
                </div>
                <p className={`text-sm font-semibold mt-1 ${card.noteColor}`}>{card.note}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="bg-white border border-gray-200 p-5 mt-5">
            <BarChart
              data={data}
              isLoading={chartLoading}
              error={chartError}
              heading={`${timeView} Statistics Overview`}
            />
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            {/* Recent Successful Hires */}
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Successful Hires</h2>
              <div className="overflow-auto max-h-80">
                {hiresLoading ? (
                  <p className="text-center text-gray-500 py-4">Loading hires...</p>
                ) : hires && hires.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Name</th>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Company</th>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Position</th>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hires.map((hire, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-2 text-xs text-gray-800">{hire.name}</td>
                          <td className="p-2 text-xs text-gray-600">{hire.company}</td>
                          <td className="p-2 text-xs text-gray-600">{hire.position}</td>
                          <td className="p-2 text-xs text-gray-600">{hire.date}</td>
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
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Enrolled Agencies/Businesses</h2>
              <div className="overflow-auto max-h-80">
                {employersLoading ? (
                  <p className="text-center text-gray-500 py-4">Loading employers...</p>
                ) : employers && employers.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Company Name</th>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Type</th>
                        <th className="text-left p-2 text-xs font-semibold text-gray-700">Active Jobs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employers.map((company, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-2 text-xs text-gray-800">{company.name}</td>
                          <td className="p-2 text-xs text-gray-600">{company.type}</td>
                          <td className="p-2 text-xs">
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