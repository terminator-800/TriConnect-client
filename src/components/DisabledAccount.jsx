import { useState } from 'react';

const DisabledAccount = ({ contractData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Alert Banner */}
      <div className="max-w-full mx-auto rounded-lg shadow-lg p-6 mb-6 bg-white border-l-7 border-red-600 border">
        <div className="flex items-start gap-3">
          <svg 
            className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2"/>
            <path d="M12 17v-2m0-4h.01M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="flex-1">
            <h2 className="text-red-600 font-semibold text-lg mb-1">
              Account Currently Disabled
            </h2>
            <p className="text-red-700 text-sm mb-4">
              Your account is temporarily disabled because you are currently employed. You cannot apply for new jobs during your active contract period.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded shadow-sm transition-colors cursor-pointer"
            >
              View Contract Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
     {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 ml-55">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-red-600">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-red-600">
              <div className="flex items-start gap-3">
                <svg 
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2"/>
                  <path d="M12 17v-2m0-4h.01M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <h2 className="text-red-600 font-semibold text-lg mb-1">
                    Account Currently Disabled
                  </h2>
                  <p className="text-red-700 text-sm">
                    Your account is temporarily disabled because you are currently employed. You cannot apply for new jobs during your active contract period.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Current Contract</h3>
              
              <div className="flex gap-6">
                {/* Left Section - Contract Info (2 Columns) */}
                <div className="flex-1 grid grid-cols-2 gap-x-16 gap-y-6">
                  {/* Column 1 */}
                  <div className="space-y-6">
                    {/* Employer */}
                    <div>
                      <label className="text-gray-600 text-sm block mb-1">
                        Employer
                      </label>
                      <p className="text-gray-900 font-medium">
                        {contractData?.employer || 'N/A'}
                      </p>
                    </div>
                    
                    {/* Start Date */}
                    <div>
                      <label className="text-gray-600 text-sm block mb-1">
                        Start Date
                      </label>
                      <p className="text-gray-900 font-medium">
                        {contractData?.start_date || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                      <label className="text-gray-600 text-sm block mb-1">
                        Job Title
                      </label>
                      <p className="text-gray-900 font-medium">
                        {contractData?.job_title || 'N/A'}
                      </p>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="text-gray-600 text-sm block mb-1">
                        End Date
                      </label>
                      <p className="text-gray-900 font-medium">
                        {contractData?.end_date || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Re-enable Notice */}
                <div className="w-80 flex-shrink-0">
                  <div className="border-2 border-blue-600 rounded-lg p-6 text-center h-full flex flex-col justify-center bg-blue-50">
                    <p className="text-gray-700 text-sm mb-2">
                      Your account will automatically re-enable again on:
                    </p>
                    <p className="text-blue-600 font-semibold text-lg">
                      {contractData?.end_date || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisabledAccount;