import { useApproveJobPost } from '../../../../../hooks/useApproveJobPost';
import { useEffect } from 'react';

const ApprovedJobPost = ({ jobPost, onClose }) => {

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const approveMutation = useApproveJobPost();
  const isLoading = approveMutation.isPending;

      const handleApprove = () => {
      const TYPE_MAP = {
        individual_job_post: 'individual',
        team_job_post: 'team',
        default: 'hiring',
      };
      const type = TYPE_MAP[jobPost.post_type] || 'hiring';

      const id = jobPost.job_post_id;

      approveMutation.mutate(
        { type, id },
        {
          onSuccess: () => onClose(),
          onError: () => alert("Something went wrong while approving the job post."),
        }
      );
    };



  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ml-55">
      <div className="p-8 backdrop-blur-2xl shadow-lg max-w-3xl w-full relative border border-gray-300">
              
        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Approve Job Post</h2>
        <p className="text-gray-700 text-center mb-4">
          Are you sure you want to approve this job post? This action cannot be undone.
        </p>

        <div className="border border-gray-300 p-5 text-gray-600 mb-4">
          <p className="text-sm">
            <strong>Job Title: </strong> {jobPost.job_title}
          </p>

          <div className="text-sm flex gap-1">
            <h3 className="font-medium">
              <strong>Posted by:</strong>
            </h3>
            <p>{jobPost.employer_name}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
            {/* Approve Button */}
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className={`
              px-10 py-1 text-white
              ${isLoading 
                ? "bg-green-500 cursor-not-allowed opacity-70"
                : "bg-green-700 hover:bg-green-600 cursor-pointer"
              }
            `}
          >
            {isLoading ? "Approving..." : "Yes, Approve"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`
              px-10 py-1 border border-gray-300
              ${isLoading 
                ? "bg-gray-200 cursor-not-allowed opacity-70"
                : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
              }
            `}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovedJobPost;
