import { useNavigate } from 'react-router-dom';
import JobPostForm from './HiringJobPostForm';

const ConfirmJobPost = ({ closeModal, role }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 ml-60">
      {/* Modal Content */}
      <div className="w-full max-w-5xl text-center shadow-lg p-6 relative border border-white backdrop-blur-2xl bottom-0 px-15 py-10">
        <h2 className="text-2xl leading-relaxed text-[#6B7280]">
          Thank you! Your job post has been moved to pending and will be reviewed by our admin
          before being published.
        </h2>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => navigate(`/${role}/manage`)}
            className="px-10 py-1 border border-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-md bg-[#2563EB] text-[#FFFFFF] cursor-pointer"
          >
            View Pending Post
          </button>

          <button
            onClick={() => {
              closeModal();
              <JobPostForm />;
            }}
            className="px-10 py-1 border border-gray-800 hover:text-white hover:bg-gray-800 transition-all shadow-md bg-[#2C3E50] text-[#FFFFFF] cursor-pointer"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmJobPost;
