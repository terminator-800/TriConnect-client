import { useDeleteJobPost } from '../../../hooks/useDeleteJobPost';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SuccessfullyDeleted from './SuccessfullyDeleted';

const ConfirmDeleteJobPost = ({ onClose, data, role }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!data) return null;

  const { deleteJobPost, isLoading } = useDeleteJobPost(role);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteJobPost(data.post_id);
      setShowSuccess(true);
    } catch (err) {
      alert('Failed to delete job post. Please try again.');
    }
  };

  if (showSuccess) {
    return <SuccessfullyDeleted jobTitle={data.job_title} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="backdrop-blur-2xl p-8 py-15 shadow-lg max-w-5xl w-full relative border border-white ml-60 mt-10">
        <p className="text-[#2C3E50] text-center mb-4 text-3xl">
          Are you sure you want to <span className="text-[#D71E1E]">remove</span> "{data.job_title}"
        </p>
        <p className="text-[#6B7280] text-center mb-15">
          This action cannot be undone. The job post and all associated data will be{' '}
          <span className="text-[#D71E1E]">permanently deleted.</span>
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-[#2563EB] hover:bg-blue-500 text-white px-15 py-1 cursor-pointer"
          >
            {isLoading ? 'Deleting...' : 'Yes'}
          </button>
          <button
            onClick={onClose}
            className="bg-[#2C3E50] hover:bg-gray-600 text-white px-15 py-1 cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteJobPost.propTypes = {
  onClose: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  data: PropTypes.shape({
    job_post_id: PropTypes.number.isRequired,
    job_title: PropTypes.string,
    location: PropTypes.string,
    salary_range: PropTypes.string,
  }),
};

export default ConfirmDeleteJobPost;
