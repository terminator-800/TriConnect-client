const isPdfFile = (url = '') => url.toLowerCase().includes('.pdf');
const isImageFile = (url = '') => /\.(png|jpg|jpeg|gif|webp)$/i.test(url);

const ViewProfile = ({ applicant, onClose, onMessageClick }) => {
  if (!applicant) return null;

  const profileSrc = applicant.profile;
  const resumeSrc = applicant.resume;
  const initials = applicant.applicant_name
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 px-4">
      <div className="relative bg-white p-6 md:p-8 shadow-lg w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-600 text-white hover:bg-red-700 text-xl font-bold cursor-pointer leading-none z-20"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-200 pb-6 pr-12">
          <div className="flex items-start gap-4">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={applicant.applicant_name}
                className="w-20 h-20 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 text-[#2563EB] text-3xl font-bold flex items-center justify-center">
                {initials || 'NA'}
              </div>
            )}

            <div>
              <h2 className="text-3xl font-bold text-[#111827]">{applicant.applicant_name}</h2>
              <p className="text-gray-600 mt-1">{applicant.email || '-'}</p>
              <p className="text-gray-600">{applicant.phone || '-'}</p>
              <p className="text-gray-600">{applicant.location || '-'}</p>
            </div>
          </div>

          {onMessageClick && (
            <button
              onClick={onMessageClick}
              className="bg-[#2563EB] text-white px-8 py-2 cursor-pointer hover:bg-blue-700 min-w-[180px]"
            >
              Send Message
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 pb-6 border-b border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Applied For</p>
            <p className="text-[#111827] font-semibold text-xl">{applicant.job_title || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Applied On</p>
            <p className="text-[#111827] font-semibold text-xl">{applicant.applied_at_formatted || '-'}</p>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#111827]">Resume</h3>
            {resumeSrc && (
              <a
                href={resumeSrc}
                target="_blank"
                rel="noreferrer"
                className="border border-[#2563EB] text-[#2563EB] px-6 py-2 hover:bg-blue-50"
              >
                Download Resume
              </a>
            )}
          </div>

          {!resumeSrc && (
            <div className="border border-gray-200 bg-gray-50 text-gray-600 px-4 py-10 text-center">
              No resume uploaded.
            </div>
          )}

          {resumeSrc && isPdfFile(resumeSrc) && (
            <iframe
              src={resumeSrc}
              title="Applicant resume"
              className="w-full h-[500px] border border-gray-200"
            />
          )}

          {resumeSrc && !isPdfFile(resumeSrc) && isImageFile(resumeSrc) && (
            <img
              src={resumeSrc}
              alt="Applicant resume"
              className="w-full max-h-[550px] object-contain border border-gray-200 bg-gray-50"
            />
          )}

          {resumeSrc && !isPdfFile(resumeSrc) && !isImageFile(resumeSrc) && (
            <div className="border border-gray-200 bg-gray-50 text-gray-600 px-4 py-10 text-center">
              Preview not available for this file type. Use Download Resume.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
