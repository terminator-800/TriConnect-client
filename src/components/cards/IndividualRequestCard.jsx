import { format, parseISO } from 'date-fns';

export const IndividualRequestCard = (msg, isSender) => {
  const {
    // job_title,
    employer_name,
    // sender_name,
    phone_number,
    email_address,
    project_location,
    start_date,
    project_description
  } = msg;

let formattedStartDate = start_date;
  try {
    formattedStartDate = format(parseISO(start_date), 'MMMM d, yyyy'); // e.g., November 29, 2025
  } catch (err) {
    console.error('Invalid date format:', start_date);
  }

  // Check if any required field is empty
  const hasEmptyFields =
    // !job_title ||
    !employer_name ||
    // !sender_name ||
    !phone_number ||
    !email_address ||
    !project_location ||
    !start_date ||
    !project_description;

  if (hasEmptyFields) {
    return (
      <div className="w-full max-w-lg px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
        <p className="text-red-700 text-sm font-semibold">⚠️ Incomplete Application</p>
        <p className="text-red-600 text-xs mt-1">Some required fields are missing.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        {/* Applied for / Job Title */}
        {/* <div className='flex gap-2'>
          <p className="text-sm">Requesting for</p>
          <h3 className="text-sm font-semibold">{job_title}</h3>
        </div> */}

        {/* Employer Name */}
        <div className='flex flex-col gap-1'>
          <label className="block text-sm font-medium text-gray-700">Employer Name</label>
          <p className="border border-[#D1D1D1] px-2 py-1 rounded">{employer_name}</p>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="border border-[#D1D1D1] px-2 py-1 rounded">{phone_number}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="w-full border border-[#D1D1D1] px-2 py-1 rounded break-all overflow-hidden">
            {email_address}
            </p>
          </div>
        </div>

        {/* Project Location & Start Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Location</label>
            <p className="border border-[#D1D1D1] px-2 py-1 rounded">{project_location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <p className="border border-[#D1D1D1] px-2 py-1 rounded">{formattedStartDate}</p>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <p className="border border-[#D1D1D1] px-2 py-1 rounded text-gray-900 break-words whitespace-pre-wrap overflow-hidden">
            {project_description}
            </p>
        </div>
      </div>
    </div>
  );
};
