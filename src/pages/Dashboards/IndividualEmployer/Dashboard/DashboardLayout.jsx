import { useState } from 'react';
import Sidebar from '../Sidebar';
import JobPostForm from '../../../../components/CreateJobPost/HiringJobPostForm';
import MainContent from './MainContent';
import FindWorkers from './FindWorkers';
import { ROLE } from '../../../../../utils/role';

const DashboardLayout = () => {
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showFindWorkers, setShowFindWorkers] = useState(false);

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        {/* Header */}
        <div className="bg-white shadow-md py-6 px-10 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#003479]">
              {showFindWorkers ? 'Find Workers' : 'Welcome, Employer!'}
            </h1>
            <p>
              {showFindWorkers
                ? 'Browse available workers from manpower agencies'
                : 'Your hiring platform statistics at a glance'}
            </p>
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFindWorkers(!showFindWorkers)}
              className="text-blue-900 border border-blue-900 font-semibold px-10 py-1 rounded hover:bg-blue-700 hover:text-white transition cursor-pointer"
            >
              {showFindWorkers ? '← Dashboard' : 'Find Workers'}
            </button>

            <button
              onClick={() => setShowJobPostModal(true)}
              className="bg-[#2563EB] text-white px-5 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              + Post Job
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        {showFindWorkers ? <FindWorkers /> : <MainContent />}
      </div>

      {/* Job Post Modal */}
      {showJobPostModal && (
        <JobPostForm onClose={() => setShowJobPostModal(false)} role={ROLE.INDIVIDUAL_EMPLOYER} />
      )}
    </>
  );
};

export default DashboardLayout;
