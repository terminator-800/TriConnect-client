import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const RequestManpowerModal = ({ isOpen, onClose, worker, onSuccessClose, role }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    employerName: '',
    phoneNumber: '',
    emailAddress: '',
    projectLocation: '',
    startDate: '',
    projectDescription: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () =>
    formData.employerName.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.emailAddress.trim() !== '' &&
    formData.projectLocation.trim() !== '' &&
    formData.startDate.trim() !== '' &&
    formData.projectDescription.trim() !== '';

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        receiver_id: worker.agency_id,
        employer_name: formData.employerName,
        phone_number: formData.phoneNumber,
        email_address: formData.emailAddress,
        project_location: formData.projectLocation,
        start_date: formData.startDate,
        project_description: formData.projectDescription,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/${role}/message-agency`, payload, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['manpowerPosts']);
      queryClient.invalidateQueries({ queryKey: ['uncontacted-agencies', role] });
      queryClient.invalidateQueries({ queryKey: ['conversations', role] });
      onClose();
      onSuccessClose({
        worker_category: worker.worker_category || '',
        agency_name: worker.agency_name || '',
      });
    },
    onError: (error) => console.error('Failed to send request:', error),
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!isFormValid()) return;
    mutation.mutate();
  };

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="backdrop-blur-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative ml-55 border border-white">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
          >
            ✕
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Manpower</h2>
            <p className="text-sm text-gray-600">Please provide your contact information</p>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Employer Name *</label>
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Project Location *</label>
                <input
                  type="text"
                  name="projectLocation"
                  value={formData.projectLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Project Description *</label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="bg-blue-600 text-white px-10 py-1 font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default RequestManpowerModal;
