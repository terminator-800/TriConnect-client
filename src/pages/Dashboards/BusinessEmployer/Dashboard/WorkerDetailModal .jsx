import React, { useState } from "react";
import icons from "../../../../assets/svg/Icons";
import RequestIndividualModal from "./RequestIndividualModal ";

const WorkerDetailModal = ({ worker, isOpen, onClose }) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  if (!isOpen || !worker) return null;
  
  console.log(worker, "individual modal");

  const handleRequestManpower = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
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
                  <h2 className="text-3xl font-bold text-gray-900">
                    {worker.worker_category}
                  </h2>
                  <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Individual
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
            {/* Years of Experience & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <span className="text-sm font-semibold justify-center flex gap-1">
                    <img className="inline-block" src={icons.job_type} alt="" /> 
                    Years of Experience
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 ml-6">
                  {worker.years_of_experience || "N/A"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <img src={icons.location_blue} alt="" className="w-4 h-4" />
                  <span className="text-sm font-semibold">Location</span>
                </div>
                <p className="text-lg text-gray-900 ml-6 font-bold">{worker.location}</p>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Qualifications
              </h3>
              <div className="p-4 border border-gray-500">
                <p className="leading-relaxed font-bold">
                  {worker.qualifications}
                </p>
              </div>
            </div>

            {/* Skills / Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Skills / Experience
              </h3>
              <div className="p-4 border border-gray-500">
                <p className="leading-relaxed font-bold">
                  {worker.skill}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                onClick={handleRequestManpower}
                className="bg-blue-600 text-white px-10 py-1 font-semibold hover:bg-blue-700 transition-colors"
              >
                Request Manpower
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Individual Modal */}
      <RequestIndividualModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        worker={worker}
      />
    </>
  );
};

export default WorkerDetailModal;