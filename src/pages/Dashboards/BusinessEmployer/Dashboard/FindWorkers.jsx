import React, { useState, useMemo } from "react"; 
import Pagination from "../../../../components/Pagination";
import WorkerDetailModal from "./WorkerDetailModal "; // Import the modal
import { useManpowerPosts } from "./useManpowerPosts";
import { ROLE } from "../../../../../utils/role";
import icons from "../../../../assets/svg/Icons";

const FindWorkers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 4;

  const { data, isLoading, isError } = useManpowerPosts(ROLE.BUSINESS_EMPLOYER);
  console.log(data);
    
  const formattedData = useMemo(() => {
    if (!data) return [];

    return data
      .map((post) => {
        if (post.type === "individual") {
          return {
            id: post.individual_job_post_id,
            jobTitle: post.worker_name || "Unnamed Worker",
            agency: post.agency_name,
            experience: post.years_of_experience
              ? `${post.years_of_experience} Years of Experience`
              : undefined,
            location: post.location,
            postedDate: post.created_at,
            type: "Individual",
             original: post,
          };
        }

        if (post.type === "team") {
          return {
            id: post.team_job_post_id,
            jobTitle: post.worker_category || "Team",
            agency: post.agency_name,
            workersAvailable: post.number_of_workers
              ? `${post.number_of_workers} Workers Available`
              : undefined,
            location: post.location,
            postedDate: post.created_at,
            type: "Team",
             original: post,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [data]);

  const totalPages = Math.ceil(formattedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = formattedData.slice(startIndex, endIndex);

  const handleWorkerClick = (worker) => {
    if (worker.type === "Individual") {
      setSelectedWorker(worker.original);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 mx-auto space-y-4 w-full p-4">
        {isLoading ? (
          <div className="p-5 text-center">Loading manpower job posts...</div>
        ) : isError ? (
          <div className="p-5 text-center text-red-600">
            Failed to load manpower posts.
          </div>
        ) : currentData.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            No job posts available.
          </div>
        ) : (
          currentData.map((worker) => (
            <div
              key={worker.id}
              className="bg-white shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleWorkerClick(worker)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {worker.jobTitle}
                  </h2>
                  <p className="text-[#828282] mb-2">
                    {worker.agency}
                    {worker.experience && <> | <span>{worker.experience}</span></>}
                    {worker.workersAvailable && <> | <span>{worker.workersAvailable}</span></>}
                  </p>
                  <div className="flex flex-wrap gap-5 text-sm text-[#828282] mt-3">
                    <div className="flex items-center gap-1">
                      <span><img src={icons.location} alt="" /></span>
                      <span>{worker.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span><img src={icons.posted_clock} alt="" /></span>
                      <span>{worker.postedDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-10 py-1 rounded-full font-medium ${
                      worker.type === "Individual"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {worker.type}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination always at the bottom */}
      <div className="pt-auto p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Worker Detail Modal */}
      <WorkerDetailModal
        worker={selectedWorker}
          
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default FindWorkers;