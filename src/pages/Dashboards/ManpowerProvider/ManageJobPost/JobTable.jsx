import { useState } from 'react';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const JobTable = ({ title, jobs, onStatusChange, onDelete, onViewJobDetails }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleToggleMenu = (jobPostId) =>
        setOpenMenuId((prevId) => (prevId === jobPostId ? null : jobPostId));

    return (
        <div className="mt-10">
            <h2 className="italic text-xl mb-2">{title}</h2>
            <div className="bg-white shadow text-gray-600">
                {/* Header */}
                <div className="bg-gray-300 font-semibold flex px-4 py-3 border-gray-500">
                    <div className="w-1/4">Job Title</div>
                    <div className="w-1/5">location</div>
                    <div className="w-1/5">Date Posted</div>
                    <div className="w-1/6">Applicants</div>
                    <div className="w-1/5">Status</div>
                </div>

                {jobs.length > 0 ? (
                    jobs.map((job) => (
                            <div key={`${job.post_type}_${job.post_id}`} className="flex justify-between px-4 py-3">
                            <div className="w-1/4">{job.job_title}</div>
                            <div className="w-1/5">{job.location}</div>
                            <div className="w-1/5">{job.created_at}</div>
                            <div className="w-1/6">{job.applicant_count || '-'}</div>
                            <div className="w-1/5 flex items-center gap-15">
                                <div className="w-1/5 flex items-center gap-2">
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
