const Agreement = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ">
      <div className="backdrop-blur-3xl p-8 shadow-lg max-w-3xl w-full h-[80vh] overflow-y-auto hide-scrollbar relative">
        
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

        <p className="text-gray-700 leading-relaxed text-justify space-y-4">
          <span className="block font-bold text-xl text-blue-800 mb-2">
            TriConnect Privacy Policy
          </span>
          Welcome to TriConnect, a platform designed to connect Jobseekers,
          Employers, and Agencies with meaningful work opportunities. Your
          privacy matters to us. This Privacy Policy explains how we collect,
          use, and protect your information.
          <br />
          <br />
          <span className="block font-bold text-lg text-blue-700">
            What we collect:
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>For Jobseekers:</strong> Name, email, phone number,
              location, job preferences, messages exchanged, and documents you
              upload (e.g., IDs, certificates).
            </li>
            <li>
              <strong>For Employers:</strong> Company profile, job postings,
              messages exchanged with jobseekers, and billing details (if
              applicable).
            </li>
            <li>
              <strong>For Agents:</strong> Personal or company info, jobseeker
              referrals, and communication history.
            </li>
            <li>
              <strong>Data Sharing:</strong> We may share information with
              trusted third parties (e.g., background check services, payment
              processors) when needed.
            </li>
            <li>
              <strong>Your Rights:</strong> You can access, update, or delete
              your data at any time.
            </li>
          </ul>
          <br />
          <span className="block font-bold text-xl text-blue-800 mt-3">
            TriConnect Terms of Service
          </span>
          <span className="block font-bold text-lg text-blue-700 mt-2">
            1. General Terms:
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You must be at least 18 years old and provide valid contact info
              to use TriConnect.
            </li>
            <li>Keep your login secure and provide accurate details.</li>
            <li>
              All content you create, such as job posts, remains yours, but by
              posting it, you grant us permission to use it within the platform.
            </li>
            <li>
              We strive for 24/7 access, but service may be temporarily
              unavailable for maintenance.
            </li>
          </ul>
          <span className="block font-bold text-lg text-blue-700 mt-4">
            2. For Jobseekers:
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload truthful and up-to-date information.</li>
            <li>Only apply to jobs you are qualified for.</li>
            <li>Impersonation or misrepresentation is prohibited.</li>
            <li>TriConnect does not guarantee job placement or offers.</li>
          </ul>
          <span className="block font-bold text-lg text-blue-700 mt-4">
            3. For Employers:
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>Post accurate, lawful, and non-discriminatory job ads.</li>
            <li>
              Respect applicants’ privacy and use their data only for
              recruitment.
            </li>
            <li>Maintain professional communication.</li>
          </ul>
          <span className="block font-bold text-lg text-blue-700 mt-4">
            4. For Agents:
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>Represent jobseekers with honesty and explicit consent.</li>
            <li>
              Charging jobseekers for services is only allowed with explicit
              permission from TriConnect.
            </li>
            <li>Misuse of jobseeker information is prohibited.</li>
          </ul>
          <span className="block font-bold text-lg text-blue-700 mt-4">
            5. Prohibited Activities (All Users):
          </span>
          <ul className="list-disc pl-6 space-y-2">
            <li>No harassment, discrimination, or fraud.</li>
            <li>No scraping, hacking, or bypassing platform security.</li>
            <li>
              Sharing false or misleading information can lead to account
              suspension.
            </li>
          </ul>
          <br />
          <span className="block font-bold text-xl text-blue-800 mt-3">
            TriConnect Fair Use & Community Guidelines
          </span>
          We value a respectful, safe, and productive community.
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Respect & Safety:</strong> Treat all users professionally,
              avoid harassment, and respect boundaries.
            </li>
            <li>
              <strong>Misuse & Misrepresentation:</strong> Do not impersonate or
              misrepresent yourself or others.
            </li>
            <li>
              <strong>No Spam or Scams:</strong> Don’t post fake jobs, mass
              messages, or solicit payment outside TriConnect.
            </li>
            <li>
              <strong>Be a Good Community Member:</strong> Provide honest
              feedback, report violations, and help us maintain a safe platform.
            </li>
          </ul>
          <br />
          <span className="block font-bold text-xl text-blue-800 mt-3">
            TriConnect Acceptance of Terms
          </span>
          By accessing or using the TriConnect platform, including but not
          limited to registering as an Employer, Jobseeker, or Agent, you agree
          to be bound by these Terms of Service and our Privacy Policy. If you
          do not agree with any of the requirements, you must not use the
          platform.
          <br />
          <br />
          If you are acting on behalf of a company or organization, you
          represent that you have the authority to bind them to these terms.
          <br />
          <br />
          Continued use of TriConnect following any updates to these terms
          constitutes your acceptance of the revised agreement.
        </p>
      </div>
    </div>
  );
};

export default Agreement;
