import { useCreateHiringJobPost } from '../../../hooks/useCreateJobPost';
import { useEffect } from 'react';
import { useState } from 'react';
import ConfirmJobPost from './ConfirmJobPost';

const JobPostForm = ({ onClose, role }) => {
  const [job_title, setJobTitle] = useState('');
  const [job_type, setJobType] = useState('');
  const [salary_range, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [required_skill, setRequiredSkill] = useState('');
  const [job_description, setJobDescription] = useState('');
  const [agreeToReview, setAgreeToReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSuccessCallback = () => {
    setJobTitle('');
    setJobType('');
    setSalaryRange('');
    setLocation('');
    setRequiredSkill('');
    setJobDescription('');
    setAgreeToReview(false);
  };

  const { mutate, isPending, isSuccess } = useCreateHiringJobPost(role, onSuccessCallback);

  const isLoading = isPending;

  useEffect(() => {
    if (isSuccess) {
      onSuccessCallback();
      setShowSuccessModal(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center  p-4 ml-60">
        <div className="relative w-full max-w-7xl shadow-lg py-6 overflow-y-auto max-h-[90vh] backdrop-blur-2xl mt-25 px-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer"
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

          <div className="w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate({
                  job_title,
                  job_type,
                  salary_range,
                  location,
                  required_skill,
                  job_description,
                });
              }}
            >
              <div className="mb-5">
                <label htmlFor="job_title" className="block font-medium">
                  Job Title
                </label>
                <input
                  id="job_title"
                  type="text"
                  className="border border-gray-300 p-2 w-full outline-none"
                  placeholder="Enter the job title"
                  value={job_title}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 flex flex-col">
                <label htmlFor="job_type" className="font-medium">
                  Job Type
                </label>
                <select
                  name="job_type"
                  id="job_type"
                  className="outline-none border border-gray-300 py-2 px-2"
                  value={job_type}
                  onChange={(e) => setJobType(e.target.value)}
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-Time</option>
                  <option value="Part-time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="mb-5 flex flex-col">
                <label htmlFor="salary_range" className="font-medium">
                  Salary Range
                </label>
                <input
                  type="number"
                  placeholder="Min - Max (PHP)"
                  className="border border-gray-300 outline-none w-1/2 px-2 py-2"
                  value={salary_range}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 flex flex-col">
                <label htmlFor="location" className="font-medium">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location"
                  className="border border-gray-300 outline-none w-1/2 px-2 py-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 flex flex-col">
                <label htmlFor="required_skill" className="font-medium">
                  Required Skill
                </label>
                <input
                  type="text"
                  placeholder="e.g., Carpentry, Driving, MS Office"
                  className="p-2 outline-none border border-gray-300"
                  value={required_skill}
                  onChange={(e) => setRequiredSkill(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="job_description" className="font-medium">
                  Job Description
                </label>
                <textarea
                  id="job_description"
                  className="border border-gray-300 p-2 w-full h-32 outline-none resize-none"
                  placeholder="Provide a detailed and clear description of the job you are offering."
                  value={job_description}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex mb-10">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={agreeToReview}
                  onChange={(e) => setAgreeToReview(e.target.checked)}
                />
                <p>
                  By selecting <strong>Confirm</strong>, you agree that this job post will be
                  reviewed by the system administrator. You will be notified once the job post is
                  verified.
                </p>
              </div>

              <div className="flex justify-center">
                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={isLoading || !agreeToReview}
                  className={`
                      px-10 py-1 text-white shadow-md
                      ${
                        !agreeToReview || isLoading
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-[#2563EB] hover:bg-blue-700 cursor-pointer'
                      }
                    `}
                >
                  {isLoading ? 'Submitting...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal appears on top */}
      {showSuccessModal && (
        <ConfirmJobPost
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
          }}
          closeModal={() => setShowSuccessModal(false)}
          role={role}
        />
      )}
    </>
  );
};

export default JobPostForm;
