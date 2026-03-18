import { useRejectJobPost } from '../../../../../hooks/useRejectJobPost';
import { useEffect } from 'react';

const RejectJobPost = ({ jobPost, onClose }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const rejectJobPostMutation = useRejectJobPost();

  const handleReject = () => {
    rejectJobPostMutation.mutate(
      { type: 'hiring', id: jobPost.job_post_id },
      {
        onSuccess: () => onClose(),
        onError: () => alert('Something went wrong while rejecting the job post.'),
      }
    );
  };

  const isLoading = rejectJobPostMutation.isPending;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ml-55">
      <div className="p-8 shadow-lg max-w-3xl w-full relative border border-gray-300 backdrop-blur-2xl">
        <h2 className="text-xl font-bold mb-4 text-red-600 text-center">Reject Job Post</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to reject this jobpost? This action cannot be undone.
        </p>

        <div className="border border-gray-300 p-5 text-gray-600 mb-4">
          <p className="text-sm"><strong>Job Title: </strong> {jobPost.job_title}</p>
          <div className="text-sm flex gap-1">
            <h3 className="font-medium"><strong>Posted by:</strong></h3>
            <p>{jobPost.employer_name}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleReject}
            disabled={isLoading}
            className={`px-10 py-1 text-white ${isLoading ? 'bg-red-500 cursor-not-allowed opacity-70' : 'bg-red-700 hover:bg-red-600 cursor-pointer'}`}
          >
            {isLoading ? 'Rejecting...' : 'Reject'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-10 py-1 border border-gray-300 ${isLoading ? 'bg-gray-200 cursor-not-allowed opacity-70' : 'hover:bg-gray-100 cursor-pointer'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectJobPost;