import PendingJobPosts from './PendingJobPost';
import { useState } from 'react';
import ApprovedJobPost from './ApprovedJobPost';
import RejectJobPost from './RejectJobPost';
import JobpostDetails from '../JobpostDetails';

export default function JobPostVerificationWrapper({ data }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleApprove = (post) => {
    setSelectedPost(post);
    setShowApproveModal(true);
  };

  const handleReject = (post) => {
    setSelectedPost(post);
    setShowRejectModal(true);
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-white to-[#00C2CB] pl-70 pr-10 pt-30">
        <div className="bg-white shadow-md py-6 px-10 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#2563EB]">Job Post Verification</h1>
            <p>Review and verify job posts to allow platform publication</p>
          </div>
        </div>

        <PendingJobPosts
          data={data}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />

        {showApproveModal && selectedPost && (
          <ApprovedJobPost jobPost={selectedPost} onClose={() => setShowApproveModal(false)} />
        )}

        {showRejectModal && selectedPost && (
          <RejectJobPost jobPost={selectedPost} onClose={() => setShowRejectModal(false)} />
        )}

        {showDetailsModal && selectedPost && (
          <JobpostDetails jobPost={selectedPost} onClose={() => setShowDetailsModal(false)} />
        )}
      </div>
    </>
  );
}
