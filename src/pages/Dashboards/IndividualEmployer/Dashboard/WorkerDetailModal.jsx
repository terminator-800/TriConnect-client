import { useState } from 'react';
// import RequestManpowerModal from './RequestManpowerModal';
import icons from '../../../../assets/svg/Icons';

const WorkerDetailModal = ({ worker, isOpen, onClose, onShowSuccess }) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  if (!isOpen || !worker) return null;

  const isTeam = worker.type === 'team';

  const handleRequestManpower = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const handleSuccessClose = (workerDetails) => {
    setIsRequestModalOpen(false);
    onClose(); // Close the WorkerDetailModal
    onShowSuccess(workerDetails); // Show success modal in parent
  };

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="backdrop-blur-2xl max-w-6xl w-full max-h-screen overflow-y-auto relative ml-55 border border-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
          >
            ✕
          </button>

          {/* Header */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{worker.worker_category}</h2>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium
                      ${isTeam 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {isTeam ? 'Team' : 'Individual'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">{worker.agency_name}</span>
                  <span>|</span>
                  <div className="flex items-center gap-1">
                    <img src={icons.posted_clock} alt="" className="w-4 h-4" />
                    <span className="text-sm">Posted {worker.approved_at}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* INDIVIDUAL FIELDS */}
            {!isTeam && (
              <>
                {/* Years of Experience & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span className="text-sm font-semibold justify-center flex gap-1 text-[#6B7280]">
                        <img className="inline-block" src={icons.job_type} alt="" />
                        Years of Experience
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 ml-6">
                      {worker.years_of_experience || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <img src={icons.location_blue} alt="" className="w-4 h-4" />
                      <span className="text-sm font-semibold text-[#6B7280]">Location</span>
                    </div>
                    <p className="text-lg text-gray-900 ml-6 font-bold">{worker.location}</p>
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h3>
                  <div className="p-4 border border-gray-500">
                    <p className="leading-relaxed font-bold">{worker.qualifications}</p>
                  </div>
                </div>

                {/* Skills / Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills / Experience</h3>
                  <div className="p-4 border border-gray-500">
                    <p className="leading-relaxed font-bold">{worker.skill}</p>
                  </div>
                </div>
              </>
            )}

            {/* TEAM FIELDS */}
            {isTeam && (
              <>
                {/* Team Size & Location */}
                <div className="grid grid-cols-2 gap-4 mb-15">
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span className="text-sm font-semibold justify-center flex gap-1 text-[#6B7280]">
                        <img className="inline-block" src={icons.job_type} alt="" />
                        Number of Workers Available
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 ml-6">
                      {worker.number_of_workers || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <img src={icons.location_blue} alt="" className="w-4 h-4" />
                      <span className="text-sm font-semibold text-[#6B7280]">Location</span>
                    </div>
                    <p className="text-lg text-gray-900 ml-6 font-bold">{worker.location}</p>
                  </div>
                </div>

                {/* Team Specialization */}
                <div>
                  <div className="flex items-center justify-start gap-2 mb-3 ">
                  <img src={icons.location} alt="team composition" />
                  <h3 className="text-sm font-semibold text-[#6B7280]">
                    Team Composition
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="px-4 py-1 border border-[#6B7280]">
                      <p className="leading-relaxed font-bold">
                        {worker.senior_workers || 0 || ''}
                      </p>
                      <span> Senior Workers (8 + years)</span>
                    </div>

                     <div className="px-4 py-1 border border-[#6B7280]">
                      <p className="leading-relaxed font-bold">
                        {worker.senior_workers || 0 || ''}
                      </p>
                      <span> Mid - Level Workers (5 - 7 years)</span>
                    </div>

                     <div className="px-4 py-1 border border-[#6B7280]">
                      <p className="leading-relaxed font-bold">
                        {worker.senior_workers || 0 || ''}
                      </p>
                      <span> Junior Workers (2 - 4 years)</span>
                    </div>

                     <div className="px-4 py-1 border border-[#6B7280]">
                      <p className="leading-relaxed font-bold">
                        {worker.senior_workers || 0 || ''}
                      </p>
                      <span> Entry - Level Workers (0 - 1 year)</span>
                    </div>
              </div>


                </div>

                {/* Team Skills / Experience */}
                <div>
                  <h3 className="text-sm font-semibold text-[#828282] mb-3">Team Skills / Experience</h3>
                  <div className="p-4 border border-gray-500">
                    <p className="leading-relaxed font-bold">{worker.team_skills || worker.skill}</p>
                  </div>
                </div>

                {/* Average Years of Experience (Optional) */}
                {worker.avg_years_of_experience && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Average Years of Experience</h3>
                    <div className="p-4 border border-gray-500">
                      <p className="text-2xl font-bold text-gray-900">{worker.avg_years_of_experience} years</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleRequestManpower}
                className="bg-blue-600 text-white px-10 py-1 font-semibold hover:bg-blue-700 transition-colors"
              >
                Request {isTeam ? 'Team' : 'Manpower'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Individual Modal */}
      <RequestManpowerModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        onSuccessClose={handleSuccessClose}
        worker={worker}
      />
    </>
  );
};

export default WorkerDetailModal;