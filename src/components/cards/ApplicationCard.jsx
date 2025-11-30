import icons from '../../assets/svg/Icons';

export const ApplicationCard = (msg, isSender) => {
  const {
    full_name,
    phone_number,
    email_address,
    current_address,
    cover_letter,
    job_title,
    resume,
  } = msg;

  // Check if any required field is empty
  const hasEmptyFields =
    !full_name ||
    !phone_number ||
    !email_address ||
    !current_address ||
    !cover_letter ||
    !job_title ||
    !resume;

  if (hasEmptyFields) {
    return (
      <div className="w-full max-w-lg px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
        <p className="text-red-700 text-sm font-semibold">⚠️ Incomplete Application</p>
        <p className="text-red-600 text-xs mt-1">Some required fields are missing.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        {/* Applied for */}
        <div>
          <p className="text-gray-900 text-base font-semibold">
            Applied for <span className="font-bold">{job_title || 'Position'}</span>
          </p>
        </div>

        {/* Contact Info - Vertical Stack */}
        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">✉</span>
            <p className="text-gray-700 text-sm">{email_address}</p>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">📱</span>
            <p className="text-gray-700 text-sm">{phone_number}</p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <span className="text-gray-400 text-sm mt-0.5">📍</span>
            <p className="text-gray-700 text-sm">{current_address}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Attached Documents */}
        {resume && (
          <div>
            <p className="text-gray-900 text-sm font-bold mb-3">Attached Documents</p>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <span>
                    <img src={icons.resume_download} alt="resume download" />
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium truncate">
                  {resume.split('/').pop()}
                </p>
                <p className="text-gray-500 text-xs">PDF • 245 KB</p>
              </div>
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <img src={icons.download_pdf_arrow} alt="" />
              </a>
              {console.log(msg)}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        <div>
          <p className="text-gray-900 text-sm font-bold mb-2">Cover Letter</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 text-sm line-clamp-4 whitespace-pre-wrap">{cover_letter}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
