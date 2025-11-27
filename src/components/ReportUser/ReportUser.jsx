import { useReportUser } from '../../../hooks/REPORT'; // Adjust the path according to your folder structure
import { useState } from 'react';
import ReportSuccessfully from './ReportSuccessfully';

const ReportUser = ({ reportedUser, conversationId, onClose, role }) => {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: submitReport, isPending } = useReportUser();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = () => {
    if (!reason) {
      alert('Please select a reason for the report.');
      return;
    }

    if (message.length < 20) {
      alert('Please provide at least 20 characters in additional details.');
      return;
    }

    if (!reportedUser?.role) {
      alert("Reported user's role is missing.");
      return;
    }

    if (files.length === 0) {
      alert('Please attach at least one file as proof.');
      return;
    }

    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('message', message);
    formData.append('reportedUserId', reportedUser?.sender_id);
    formData.append('conversationId', conversationId);

    files.forEach((file) => formData.append('proof_files', file));

    submitReport(
      { formData, role },
      {
        onSuccess: () => {
          setShowSuccess(true); // show success first
          setTimeout(() => {
            onClose(); // close the report form after 2 seconds (optional)
          }, 5000);
        },

        onError: (error) => {
          console.error('❌ Error submitting report:', error);
        },
      }
    );
  };

  const reportOptions = [
    {
      value: 'spam',
      label: 'Spam or Irrelevant Application',
      description: 'Application is unrelated to the job posting',
    },
    {
      value: 'inappropriate',
      label: 'Inappropriate Content',
      description: 'Contains offensive or unprofessional content',
    },
    {
      value: 'fake',
      label: 'Fake Profile or Credentials',
      description: 'Suspected false information or fraudulent documents',
    },
    {
      value: 'duplicate',
      label: 'Duplicate Application',
      description: 'Same applicant submitted multiple times',
    },
    {
      value: 'harassment',
      label: 'Harassment or Abuse',
      description: 'Threatening, abusive, or harassing behavior',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other concerns not listed above',
    },
  ];

  const authorizedPerson = reportedUser?.authorized_person || 'User';
  const jobTitle = reportedUser?.job_title || 'Position';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
        <div className="backdrop-blur-2xl px-15 py-5 w-full max-w-7xl relative shadow-2xl max-h-screen overflow-y-auto ml-60 border border-white mt-25">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-5 absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Report Applicant</h2>
            <p className="text-gray-600 text-sm">
              {authorizedPerson} - {jobTitle}
            </p>
            <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> Your report will be kept confidential.
                The applicant will not be notified of who submitted the report.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Select Reason */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Select Reason for Report <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {reportOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                      reason === option.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 h-5 w-5 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                    <div className="ml-3">
                      <span className="block font-semibold text-gray-800 text-sm">
                        {option.label}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Additional Details */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">
                  Additional Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  maxLength={500}
                  placeholder="Please provide specific details about why you're reporting this applicant. Include any relevant information that will help us..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-[10vh]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters required
                  <span className="float-right">{message.length} / 500</span>
                </p>
              </div>

              {/* Supporting Evidence */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">
                  Supporting Evidence <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:border-gray-400 transition cursor-pointer h-[10vh]"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">
                      Upload screenshots or documents to support your report
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, PDF up to 5MB</p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  name="proof_files"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded text-sm border border-gray-200"
                      >
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="flex-1 truncate text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className={`px-10 py-1 transition font-semibold cursor-pointer ${
                  isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isPending ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={onClose}
                disabled={isPending}
                className="bg-gray-700 hover:bg-gray-800 text-white px-10 py-1 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && <ReportSuccessfully onClose={() => setShowSuccess(false)} />}
    </>
  );
};

export default ReportUser;
