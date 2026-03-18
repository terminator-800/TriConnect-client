import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ROLE } from '../../../../../utils/role';
import axios from 'axios';
import icons from '../../../../assets/svg/Icons';
import socket from '../../../../../utils/socket';

const Apply = ({ employer, onClose }) => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'submitted'
  const [formData, setFormData] = useState({
    resume: null,
    cover_letter: '',
    job_title: employer?.job_title || '',
    company_name: employer?.company_name || '',
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ job_post_id, receiver_id, formData }) => {
      const multipartData = new FormData();
      multipartData.append('job_post_id', job_post_id);
      multipartData.append('receiver_id', receiver_id);
      multipartData.append('cover_letter', formData.cover_letter);
      multipartData.append('job_title', formData.job_title);

      if (formData.resume) {
        multipartData.append('files', formData.resume);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/${ROLE.JOBSEEKER}/applications`,
        multipartData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      socket.emit('sendMessage', {
        receiver_id: employer.user_id,
        message_text: formData.cover_letter,
        file_url: data.file_url,
      });

      queryClient.invalidateQueries(['jobPostsByUser']);
      setCurrentStep('submitted');
    },
    onError: (error) => {
      setValidationError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    },
  });

  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB 
    return file.size <= maxSize;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setValidationError('Only PDF files are allowed');
      setFormData((prev) => ({ ...prev, resume: null }));
      e.target.value = '';
      return;
    }

    if (!validateFileSize(file)) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setValidationError(`File size is ${fileSizeMB}MB. Maximum allowed is 10MB`);
      setFormData((prev) => ({ ...prev, resume: null }));
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
    
    setValidationError('');
     };

  const handleSubmitApplication = () => {
    // Validation
    if (!formData.resume) {
      setValidationError('Resume is required');
      return;
    }

    setValidationError('');
    mutation.mutate({
      job_post_id: employer.job_post_id,
      receiver_id: employer.user_id,
      formData,
    });
  };

  const isSubmitting = mutation.isPending;

  // Submitted Step
  if (currentStep === 'submitted') {
    return (
      <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center p-4 z-50 ml-55">
        <div className="backdrop-blur-2xl shadow-lg max-w-5xl w-full relative">
          <button
            onClick={onClose}
            aria-label="Close application modal"
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold text-lg cursor-pointer"
          >
            ✕
          </button>

          <div className="py-24 px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Application Submitted!</h1>

            <p className="text-lg text-gray-500">
              Your application for{' '}
              <span className="font-semibold text-gray-700">
                {formData.job_title || 'this position'}
              </span>{' '}
              at{' '}
              <span className="font-semibold text-gray-700">
                {employer.employer_name || 'the company'}
              </span>{' '}
              has been
              <br />
              successfully submitted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form Step
  return (
    <div className="w-full max-w-6xl border border-gray-300 shadow-2xl max-h-[90vh] flex flex-col backdrop-blur-2xl xl:ml-55 md:mx-5">
      {/* Header */}
      <div className="flex justify-between items-center pt-6 pr-6 max-[769px]:p-4">
        {/* <div>
          <h2 className="text-2xl max-[769px]:text-xl font-bold text-gray-900">Submit Your Application</h2>
          <p className="text-sm max-[769px]:text-xs text-gray-600">Upload your resume and cover letter</p>
        </div> */}
        <button
          onClick={onClose}
          aria-label="Close application form"
          className="ml-auto text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 max-[769px]:w-7 max-[769px]:h-7 flex items-center justify-center font-bold text-lg max-[769px]:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-8 max-[769px]:p-4 overflow-y-auto flex-1 flex flex-col">
        {/* Error Message */}
        {validationError && (
          <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700 text-sm mb-6">
            ✕ {validationError}
          </div>
        )}

        {/* Upload Documents Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600 mb-6">Attach your resume and cover letter</p>

          <div className="grid grid-cols-2 gap-6 max-[769px]:grid-cols-1">
            {/* Resume Upload */}
            <div>
              <label
                htmlFor="file"
                className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
              >
                <img src={icons.resume} alt="Resume icon" /> Resume / CV{' '}
                <span className="text-red-600">*</span>
              </label>
              <label
                htmlFor="file"
                className="border-2 border-dashed border-gray-400 bg-blue-50 rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center hover:bg-blue-100 transition"
                role="button"
                tabIndex={0}
                aria-label="Click to upload or drag and drop resume"
              >
                <span className="text-3xl mb-2">
                  <img src={icons.drag_drop} alt="" />
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">PDF (Max 10MB)</span>
              </label>
              <input
                id="file"
                type="file"
                name="files"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
                aria-label="File input for resume upload"
                required
              />
              {formData.resume && (
                <p className="text-sm text-green-600 mt-2">✓ {formData.resume.name}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="cover_letter"
                className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
              >
                <img src={icons.cover_letter} alt="Cover letter icon" /> Cover Letter{' '}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleInputChange}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className="w-full p-3 border border-gray-300 rounded bg-white resize-none outline-none focus:border-blue-500 disabled:bg-gray-200"
                rows="5"
                disabled={isSubmitting}
                aria-label="Cover letter input"
              />
            </div>
          </div>
        </div>
              
        <button
          onClick={handleSubmitApplication}
          disabled={isSubmitting}
          className={`mt-6 w-fit self-center px-10 py-1 text-white font-semibold transition ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Apply;