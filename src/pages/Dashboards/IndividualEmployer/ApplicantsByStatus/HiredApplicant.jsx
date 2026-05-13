import ApplicantsByStatusLayout from './ApplicantsByStatusLayout';

const HiredApplicant = () => (
  <ApplicantsByStatusLayout
    status="accepted"
    pageTitle="Hired Applicants"
    subtitle="View and manage your hired employees"
    emptyLabel="No hired applicants found."
  />
);

export default HiredApplicant;
