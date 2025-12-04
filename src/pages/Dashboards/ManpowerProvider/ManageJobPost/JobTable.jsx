import { useState } from 'react';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const JobTable = ({ title, jobs, onStatusChange, onDelete, onViewJobDetails, activePostType }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleToggleMenu = (jobPostId) =>
    setOpenMenuId((prevId) => (prevId === jobPostId ? null : jobPostId));

  // Define columns based on post type
  const getColumns = () => {
    switch (activePostType) {
      case 'hiring':
        return [
          { key: 'job_title', label: 'Job Title', width: 'w-1/5' },
          { key: 'type', label: 'Type', width: 'w-1/6' },
          { key: 'created_at', label: 'Date Posted', width: 'w-1/5' },
          { key: 'applicant_count', label: 'Applicants', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/5' },
        ];
      case 'individual':
        return [
          { key: 'job_title', label: 'Job Category', width: 'w-1/6' },
          { key: 'job_description', label: 'Experience', width: 'w-1/6' },
          { key: 'location', label: 'Location', width: 'w-1/5' },
          { key: 'created_at', label: 'Date Posted', width: 'w-1/6' },
          { key: 'applicant_count', label: 'Requests', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/6' },
        ];
      case 'team':
        return [
          { key: 'job_title', label: 'Job Category', width: 'w-1/6' },
          { key: 'workers_available', label: 'Workers Available', width: 'w-1/6' },
          { key: 'location', label: 'Location', width: 'w-1/5' },
          { key: 'created_at', label: 'Date Posted', width: 'w-1/6' },
          { key: 'applicant_count', label: 'Requests', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/6' },
        ];
      default:
        // Default to hiring columns if activePostType is undefined
        return [
          { key: 'job_title', label: 'Job Title', width: 'w-1/5' },
          { key: 'type', label: 'Type', width: 'w-1/6' },
          { key: 'created_at', label: 'Date Posted', width: 'w-1/5' },
          { key: 'applicant_count', label: 'Applicants', width: 'w-1/6' },
          { key: 'status', label: 'Status', width: 'w-1/5' },
        ];
    }
  };

  const columns = getColumns();

  // Get cell value based on column key
  const getCellValue = (job, key) => {
    switch (key) {
      case 'type':
        return job.job_type || 'Contractual';
      case 'workers_available':
        return job.number_of_workers ? `${job.number_of_workers} workers` : '-';
      case 'applicant_count':
        return job.applicant_count || '-';
      case 'job_description':
        return job.years_of_experience
          ? `${job.years_of_experience} Years`
          : job.job_description || '-';
      case 'job_title':
        // For individual and team posts, show worker_category instead of job_title
        if (activePostType === 'individual' || activePostType === 'team') {
          return job.worker_category || job.job_title || '-';
        }
        return job.job_title || '-';
      default:
        return job[key] || '-';
    }
  };

  return (
    <div className="mt-10">
      <h2 className="italic text-xl mb-2">{title}</h2>
      <div className="bg-white shadow text-gray-600">
        {/* Header */}
        <div className="bg-gray-300 font-semibold flex px-4 py-3 border-gray-500 text-gray-800">
          {columns.map((col) => (
            <div key={col.key} className={col.width}>
              {col.label}
            </div>
          ))}
        </div>

        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={`${job.post_type}_${job.post_id}`} className="flex justify-between px-4 py-3">
              {columns.map((col) => (
                <div key={col.key} className={col.width}>
                  {col.key === 'status' ? (
                    <div className="flex items-center gap-15">
                      <div className="flex items-center gap-2">
                        {job.jobpost_status === 'pending' ? (
                          <div className="flex items-center gap-2 border border-gray-500 rounded-full px-4 w-fit">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-gray-600 text-md font-medium">Pending</span>
                          </div>
                        ) : job.jobpost_status === 'rejected' ? (
                          <div className="flex items-center gap-2 border border-red-500 rounded-full px-4 w-fit">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-red-600 text-md font-medium">Rejected</span>
                          </div>
                        ) : (
                          <StatusDropdown
                            status={job.jobpost_status}
                            onChange={(status) =>
                              onStatusChange({ jobPostId: job.post_id, status, job })
                            }
                          />
                        )}
                      </div>

                      <ActionMenu
                        isOpen={openMenuId === job.post_id}
                        onToggle={() => handleToggleMenu(job.post_id)}
                        onDeleteClick={() => onDelete(job)}
                        onViewJobDetails={() => onViewJobDetails(job)}
                      />
                    </div>
                  ) : (
                    getCellValue(job, col.key)
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 italic">No jobs found.</div>
        )}
      </div>
    </div>
  );
};

export default JobTable;
