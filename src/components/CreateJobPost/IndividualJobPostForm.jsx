import { useState, useEffect } from 'react';
import ConfirmJobPost from './ConfirmJobPost';
import { useCreateIndividualJobPost } from '../../../hooks/useCreateJobPost';

const IndividualJobPostForm = ({ onClose, role }) => {
  const [formData, setFormData] = useState({
    worker_name: '',
    worker_category: '',
    years_of_experience: '',
    location: '',
    qualifications: '',
    skill: '',
  });

  const [agreeToReview, setAgreeToReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Hook for creating individual job post
  const createJobPostMutation = useCreateIndividualJobPost(role, () => {
    setShowSuccessModal(true);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!agreeToReview) return;

    // Convert numeric field to number
    const payload = {
      ...formData,
      years_of_experience: Number(formData.years_of_experience),
    };

    createJobPostMutation.mutate(payload);
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      worker_name: '',
      worker_category: '',
      years_of_experience: '',
      location: '',
      qualifications: '',
      skill: '',
    });
    setAgreeToReview(false);
  };

  // Handle errors
  useEffect(() => {
    if (createJobPostMutation.isError) {
      alert(createJobPostMutation.error?.response?.data?.error || 'Failed to create job post');
    }
  }, [createJobPostMutation.isError]);

  return (
    <>
      {/* Main Form Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
        <div className="relative w-full max-w-7xl shadow-lg py-6 overflow-y-auto  bg-white px-10 h-[90vh]">
          {/* Close Button */}
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

          {/* Form Content */}
          <div className="space-y-6">
            {/* Worker Name */}
            <div>
              <label className="block font-semibold mb-2">Worker Name</label>
              <input
                type="text"
                name="worker_name"
                value={formData.worker_name}
                onChange={handleChange}
                placeholder="e.g., Juan Dela Cruz (or leave blank)"
                className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Optional - can be kept anonymous</p>
            </div>

            {/* Worker Category / Type */}
            <div>
              <label className="block font-semibold mb-2">
                Worker Category / Type <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="worker_category"
                value={formData.worker_category}
                onChange={handleChange}
                placeholder="e.g., Electrician"
                className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
              />
            </div>

            {/* Years of Experience and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">
                  Years of Experience <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your city and province..."
                  className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block font-semibold mb-2">
                Qualifications <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g., College degree, Certifications, Licenses..."
                className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                List worker's education, certifications, licenses, and training completed
              </p>
            </div>

            {/* Skills / Experience */}
            <div>
              <label className="block font-semibold mb-2">
                Skills / Experience <span className="text-red-600">*</span>
              </label>
              <textarea
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                placeholder="Describe the worker's skills, certifications, and relevant experience..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 resize-none bg-white
                                focus:outline-none focus:ring-0 focus:border-gray-300"
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="flex mb-10">
              <input
                type="checkbox"
                className="mr-3"
                checked={agreeToReview}
                onChange={(e) => setAgreeToReview(e.target.checked)}
              />
              <p>
                By selecting <strong>Confirm</strong>, you agree that this job post will be reviewed
                by the system administrator. You will be notified once the job post is verified.
              </p>
            </div>
            {/* Confirm Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                disabled={createJobPostMutation.isLoading || !agreeToReview}
                onClick={handleSubmit}
                className={`px-10 py-1 text-white shadow-md ${
                  !agreeToReview || createJobPostMutation.isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {createJobPostMutation.isLoading ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal using ConfirmJobPost */}
      {showSuccessModal && <ConfirmJobPost closeModal={handleCreateAnother} role={role} />}
    </>
  );
};

export default IndividualJobPostForm;
