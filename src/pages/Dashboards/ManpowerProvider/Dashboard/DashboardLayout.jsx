import { useState } from 'react';
import Sidebar from '../Sidebar';
import JobPostForm from '../../../../components/CreateJobPost/HiringJobPostForm';
import MainContent from './MainContent';
import { ROLE } from '../../../../../utils/role';
import BrowseJob from './BrowseJob';
import IndividualJobPostForm from '../../../../components/CreateJobPost/IndividualJobPostForm';
import TeamJobPostForm from '../../../../components/CreateJobPost/TeamJobPostForm';
const DashboardLayout = () => {
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showFindWorkers, setShowFindWorkers] = useState(false);
  const [postType, setPostType] = useState('');

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
              {showFindWorkers ? '← Dashboard' : 'Find Jobs'}
            </button>

            <select
              className="text-[#6B7280] outline rounded-lg border-[#6B7280] px-5 py-2  transition cursor-pointer"
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                setPostType(value);
                setShowJobPostModal(true);
              }}
            >
              <option value="" hidden> + Post Job </option>
              <option value="hiring">Hiring Post</option>
              <option value="individual">Individual Post</option>
              <option value="team">Team Post</option>
            </select>

          </div>
        </div>

        {/* Conditional Content */}
        {showFindWorkers ? <BrowseJob /> : <MainContent />}
      </div>

       
        {/* Job Post Modal */}
        {showJobPostModal && (
          postType === 'individual' ? (
            <IndividualJobPostForm
              onClose={() => setShowJobPostModal(false)}
              role={ROLE.MANPOWER_PROVIDER}
            />
          ) : postType === 'team' ? (
            <TeamJobPostForm
              onClose={() => setShowJobPostModal(false)}
              role={ROLE.MANPOWER_PROVIDER}
            />
          ) : (
            <JobPostForm
              onClose={() => setShowJobPostModal(false)}
              role={ROLE.MANPOWER_PROVIDER}
              postType={postType}
            />
          )
        )}
    </>
  );
};

export default DashboardLayout;
