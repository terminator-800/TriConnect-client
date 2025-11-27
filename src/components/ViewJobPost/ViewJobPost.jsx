import { useState } from "react";
import { useEditJobPost } from "../../../hooks/useJobposts";
import UpdateSuccess from "./UpdateSuccess";

const ViewJobPost = ({ data, onClose, role }) => {
  const job = data.active[0] || {};
  const editJobPost = useEditJobPost(role);

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    job_title: job.job_title || "",
    job_type: job.job_type || "",
    salary_range: job.salary_range || "",
    location: job.location || "",
    required_skill: job.required_skill || "",
    job_description: job.job_description || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = () => {
    if (isEditing) {
      editJobPost.mutate(
        {
          job_post_id: job.job_post_id,
          ...formData,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            setShowSuccess(true);
            // setTimeout(() => {
            //   setShowSuccess(false);
            //   onClose();
            // }, 2000);
          },
        }
      );
    } else {
      setIsEditing(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mt-25 ml-60">
        <div className="w-full max-w-7xl shadow-lg p-6 relative border border-white backdrop-blur-2xl bottom-0 px-15 py-10">
          {data.role}
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

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Job Type</label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 outline-none"
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Salary Range</label>
                <input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Required Skill</label>
              <input
                type="text"
                name="required_skill"
                value={formData.required_skill}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Job Description
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full border-2 border-gray-300 px-3 py-2 bg-gray-100 h-32 resize-none outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleEditSave}
              disabled={editJobPost.isLoading}
              className="px-10 py-1 bg-[#2563EB] text-white hover:bg-blue-700 cursor-pointer"
            >
              {editJobPost.isLoading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Edit Job"}
            </button>

            <button
              onClick={onClose}
              className="px-10 py-1 bg-[#2C3E50] text-white hover:bg-gray-900 cursor-pointer"
            >
              Cancel
            </button>

            {editJobPost.isError && (
              <p className="text-red-500 mt-2">
                Error saving job: {editJobPost.error.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Show success modal when update is successful */}
      {showSuccess && <UpdateSuccess onClose={handleCloseSuccess} />}
    </>
  );
};

export default ViewJobPost;
