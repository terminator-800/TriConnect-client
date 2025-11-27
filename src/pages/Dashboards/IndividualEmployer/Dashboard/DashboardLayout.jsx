import React, { useState } from "react";
import Sidebar from "../Sidebar";
import JobPostForm from "../../../../components/CreateJobPost/HiringJobPostForm";
import { ROLE } from "../../../../../utils/role";

const DashboardLayout = () => {
  const [showJobPostModal, setShowJobPostModal] = useState(false);

  const stats = [
    { label: "TOTAL APPLICANTS", value: 601, color: "text-gray-800" },
    { label: "APPLIED", value: 35, color: "text-blue-600" },
    { label: "HIRED", value: 92, color: "text-green-600" },
    { label: "REJECTED", value: 8, color: "text-red-600" },
  ];

  const jobPosts = [
    {
      title: "Construction Worker",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Delivery Driver",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Office Assistant",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Cashier",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Dishwasher",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Graphics Designer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Software Developer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Construction Worker",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Delivery Driver",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Office Assistant",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Cashier",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Dishwasher",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Graphics Designer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Software Developer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Construction Worker",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Delivery Driver",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Office Assistant",
      type: "Long Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Cashier",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Dishwasher",
      type: "Short Term",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Graphics Designer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
    {
      title: "Software Developer",
      type: "Contractual",
      date: "2025-04-10",
      applicants: 2,
      status: "Active",
    },
  ];

  const applicants = [
    {
      name: "Alvin Sangco",
      job: "Construction Worker",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Denesse Membrano",
      job: "Delivery Driver",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Phenlay Azorcon",
      job: "Office Assistant",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Samantha Ferrer",
      job: "Cashier",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Lanilyn Mongado",
      job: "Dishwasher",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Maureen Baroro",
      job: "Graphics Designer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Ayaka Dadivas",
      job: "Software Developer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Alvin Sangco",
      job: "Construction Worker",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Denesse Membrano",
      job: "Delivery Driver",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Phenlay Azorcon",
      job: "Office Assistant",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Samantha Ferrer",
      job: "Cashier",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Lanilyn Mongado",
      job: "Dishwasher",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Maureen Baroro",
      job: "Graphics Designer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Ayaka Dadivas",
      job: "Software Developer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Alvin Sangco",
      job: "Construction Worker",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Denesse Membrano",
      job: "Delivery Driver",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Phenlay Azorcon",
      job: "Office Assistant",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Samantha Ferrer",
      job: "Cashier",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Lanilyn Mongado",
      job: "Dishwasher",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Maureen Baroro",
      job: "Graphics Designer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
    {
      name: "Ayaka Dadivas",
      job: "Software Developer",
      location: "Cabadbaran City",
      date: "2025-04-10",
    },
  ];

  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-linear-to-b from-white to-cyan-400 pl-70 pr-10 pt-30">
        
        {/* Header */}
        <div className="bg-white shadow-md py-6 px-10 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#003479]">
              Welcome, Employer!
            </h1>
            <p>Your hiring platform statistics at a glance</p>
          </div>
          <button
            onClick={() => setShowJobPostModal(true)}
            className="bg-[#2563EB] text-white px-5 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            + Post Job
          </button>
        </div>

        {/* Stats (non-map version) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-left">
          <div className="bg-white shadow p-6  hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              TOTAL APPLICANTS
            </h3>
            <p className="text-3xl font-bold text-gray-800">601</p>
          </div>
          <div className="bg-white shadow p-6  hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 mb-2">APPLIED</h3>
            <p className="text-3xl font-bold text-blue-600">35</p>
          </div>
          <div className="bg-white shadow p-6  hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 mb-2">HIRED</h3>
            <p className="text-3xl font-bold text-green-600">92</p>
          </div>
          <div className="bg-white shadow p-6  hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 mb-2">REJECTED</h3>
            <p className="text-3xl font-bold text-red-600">8</p>
          </div>
        </div>

        {/* Tables */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Job Posts */}
          <div className="bg-white shadow overflow-hidden px-10">
            <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Job Posts</h2>
            <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                  <tr>
                    <th className="p-3 font-semibold">Job Title</th>
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Date Posted</th>
                    <th className="p-3 font-semibold">Applicants</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPosts.map((job, i) => (
                    <tr
                      key={i}
                      className=" hover:bg-gray-100 border-b border-[#E5E7EB] text-[#1F2937]"
                    >
                      <td className="p-3">{job.title}</td>
                      <td className="p-3">{job.type}</td>
                      <td className="p-3">{job.date}</td>
                      <td className="p-3">{job.applicants}</td>
                      <td className="p-3 text-blue-600 font-medium cursor-pointer">
                        {job.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="bg-white shadow overflow-hidden px-10">
            <h2 className="text-lg font-semibold py-4 text-[#1F2937]">Recent Applicants</h2>
            <div className="overflow-y-auto max-h-96 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-[#EFF0F1] sticky top-0 z-10 text-[#374151]">
                  <tr>
                    <th className="p-3 font-semibold">
                      Applicant Name
                    </th>
                    <th className="p-3 font-semibold">Job Position</th>
                    <th className="p-3 font-semibold">Location</th>
                    <th className="p-3 font-semibold">Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#E5E7EB] hover:bg-gray-100 text-[#1F2937]"
                    >
                      <td className="p-3">{app.name}</td>
                      <td className="p-3">{app.job}</td>
                      <td className="p-3">{app.location}</td>
                      <td className="p-3">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Post Modal */}
      {showJobPostModal && (
          <JobPostForm 
            onClose={() => setShowJobPostModal(false)} 
            role={ROLE.INDIVIDUAL_EMPLOYER}
          />
      )}

    </>
  );
};

export default DashboardLayout;
