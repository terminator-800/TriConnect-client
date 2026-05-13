import ApplicantsByStatusLayout from './ApplicantsByStatusLayout';

const RejectedApplicant = () => (
  <ApplicantsByStatusLayout
    status="rejected"
    pageTitle="Reject Applicants"
    subtitle="Review applicants who were not selected for positions"
    emptyLabel="No rejected applicants found."
  />
);

export default RejectedApplicant;
