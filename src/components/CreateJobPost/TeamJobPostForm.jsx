import { useState, useEffect } from "react";
import ConfirmJobPost from "./ConfirmJobPost";
import { useCreateTeamJobPost } from "../../../hooks/useCreateJobPost";

const TeamJobPostForm = ({ onClose, role }) => {
  const [formData, setFormData] = useState({
    worker_category: "",
    number_of_workers: "",
    location: "",
    senior_workers: "",
    mid_level_workers: "",
    junior_workers: "",
    entry_level_workers: "",
    team_skills: "",
  });

  const [agreeToReview, setAgreeToReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use the hook
  const createTeamJobPostMutation = useCreateTeamJobPost(role, () => {
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

    createTeamJobPostMutation.mutate(formData);
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      worker_category: "",
      number_of_workers: "",
      location: "",
      senior_workers: "",
      mid_level_workers: "",
      junior_workers: "",
      entry_level_workers: "",
      team_skills: "",
    });
    setAgreeToReview(false);
  };

  useEffect(() => {
    if (createTeamJobPostMutation.isError) {
      alert(createTeamJobPostMutation.error?.response?.data?.error || 'Failed to create job post');
    }
  }, [createTeamJobPostMutation.isError]);

  return (
    <>
      {/* Main Form Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4 ml-55">
        <div className="relative w-full max-w-7xl shadow-lg py-6 overflow-y-auto max-h-[90vh] backdrop-blur-2xl mt-25 px-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer"
          >
            <svg
              className="w-5 h-5"
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

          {/* Form Content */}
          <div className="space-y-6">
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

            {/* Number of Workers and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">
                  Number of Workers Available{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="number_of_workers"
                  value={formData.number_of_workers}
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

            {/* Team Composition */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Team Composition <span className="text-red-600">*</span>
              </label>
              <div className="bg-[#D9D9D9] p-6 space-y-4">
                {/* Senior and Mid-Level Workers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Senior Workers (8+ years)
                    </label>
                    <input
                      type="number"
                      name="senior_workers"
                      value={formData.senior_workers}
                      onChange={handleChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Mid - Level Workers (5-7 years)
                    </label>
                    <input
                      type="number"
                      name="mid_level_workers"
                      value={formData.mid_level_workers}
                      onChange={handleChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Junior and Entry-Level Workers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Junior Workers (2-4 years)
                    </label>
                    <input
                      type="number"
                      name="junior_workers"
                      value={formData.junior_workers}
                      onChange={handleChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Entry - Level Workers (0-1 year)
                    </label>
                    <input
                      type="number"
                      name="entry_level_workers"
                      value={formData.entry_level_workers}
                      onChange={handleChange}
                      placeholder="e.g., 0"
                      className="w-full p-2 border border-gray-300 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-2">
                  Note: Total should match the number of workers above
                </p>
              </div>
            </div>

            {/* Team Skills / Experience */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Team Skills / Experience <span className="text-red-600">*</span>
              </label>
              <textarea
                name="team_skills"
                value={formData.team_skills}
                onChange={handleChange}
                placeholder="Describe the team's skills, experience level, and what projects they're suitable for..."
                rows="4"
                className="w-full p-2 border border-gray-300 focus:outline-none bg-white resize-none"
              />
            </div>

            {/* Agreement Checkbox */}
            <div className="flex mb-3">
              <input
                type="checkbox"
                className="mr-3 mt-1"
                checked={agreeToReview}
                onChange={(e) => setAgreeToReview(e.target.checked)}
              />
              <p>
                By selecting <strong>Confirm</strong>, you agree that this job
                post will be reviewed by the system administrator. You will be
                notified once the job post is verified.
              </p>
            </div>

            {/* Confirm Button */}
             <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={createTeamJobPostMutation.isLoading || !agreeToReview}
                onClick={handleSubmit}
                className={`
                    px-10 py-1 text-white shadow-md
                    ${
                      !agreeToReview || createTeamJobPostMutation.isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    }
                  `}
              >
                {createTeamJobPostMutation.isLoading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal using ConfirmJobPost */}
      {showSuccessModal && (
        <ConfirmJobPost closeModal={handleCreateAnother} role={role} />
      )}
    </>
  );
};

export default TeamJobPostForm;
