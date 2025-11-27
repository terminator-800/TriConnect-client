import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ROLE } from '../../../../../utils/role';
import axios from 'axios';
import icons from '../../../../assets/svg/Icons';
import socket from '../../../../../utils/socket';
import ReviewApplication from './ReviewApplication';

const Apply = ({ employer, onClose }) => {
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'review'
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        email_address: '',
        current_address: '',
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
            multipartData.append("job_post_id", job_post_id);
            multipartData.append("receiver_id", receiver_id);
            multipartData.append("full_name", formData.full_name);
            multipartData.append("phone_number", formData.phone_number);
            multipartData.append("email_address", formData.email_address);
            multipartData.append("current_address", formData.current_address);
            multipartData.append("cover_letter", formData.cover_letter);
            multipartData.append("job_title", formData.job_title);

            if (formData.resume) {
                multipartData.append("files", formData.resume);
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/${ROLE.JOBSEEKER}/applications`,
                multipartData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },  
                }
            );

            return res.data;
        },
        onSuccess: (data) => {
            socket.emit("sendMessage", {
                receiver_id: employer.user_id,
                message_text: formData.cover_letter,
                file_url: data.file_url,
            });

            queryClient.invalidateQueries(['jobPostsByUser']);
            setCurrentStep('submitted');
        },
        onError: (error) => {
            setValidationError(error.response?.data?.message || 'Something went wrong. Please try again.');
        },
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateFileSize = (file) => {
        const maxSize = 6 * 1024 * 1024; // 5MB
        return file.size <= maxSize;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateFileSize(file)) {
            setValidationError('File size must be less than 5MB');
            e.target.value = '';
            return;
        }

        setFormData(prev => ({
            ...prev,
            resume: file
        }));
        setValidationError('');
    };

    const handleContinue = () => {
        // Validation
        if (!formData.full_name.trim()) {
            setValidationError('Full name is required');
            return;
        }
        if (!formData.phone_number.trim()) {
            setValidationError('Phone number is required');
            return;
        }
        if (!formData.email_address.trim()) {
            setValidationError('Email address is required');
            return;
        }
        if (!validateEmail(formData.email_address)) {
            setValidationError('Please enter a valid email address');
            return;
        }
        if (!formData.current_address.trim()) {
            setValidationError('Current address is required');
            return;
        }
        if (!formData.resume) {
            setValidationError('Resume is required');
            return;
        }

        setValidationError('');
        setCurrentStep('review');
    };

    const handleBack = () => {
        setCurrentStep('form');
        setValidationError('');
    };

    const handleSubmitApplication = () => {
        mutation.mutate({
            job_post_id: employer.job_post_id,
            receiver_id: employer.user_id,
            formData
        });
    };

    const isSubmitting = mutation.isPending;

    // Submitted Step
    if (currentStep === 'submitted') {
        return (
            <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center p-4 z-50 ml-55 mt-40">
                <div className="backdrop-blur-2xl shadow-lg max-w-5xl w-full relative">
                    <button
                        onClick={onClose}
                        aria-label="Close application modal"
                        className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold text-lg cursor-pointer"
                    >
                        ✕
                    </button>

                    <div className="py-24 px-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">
                            Application Submitted!
                        </h1>
                        
                        <p className="text-lg text-gray-500">
                            Your application for <span className="font-semibold text-gray-700">{formData.job_title || 'this position'}</span> at <span className="font-semibold text-gray-700">{employer.employer_name || 'the company'}</span> has been
                            <br />
                            successfully submitted.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Form Step
    if (currentStep === 'form') {
        return (
            <div className="backdrop-blur-2xl w-full max-w-7xl border border-gray-300 shadow-2xl overflow-hidden max-[769px]:mx-4 max-[769px]:mt-4 ml-55 mt-20">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 max-[769px]:p-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-600">Please provide your contact information</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close application form"
                        className="text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-[769px]:p-4 overflow-y-auto max-h-[80vh]">
                    
                    {/* Error Message */}
                    {validationError && (
                        <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700 text-sm mb-6">
                            ✕ {validationError}
                        </div>
                    )}

                    <div className="mb-8">
                        {/* Form Grid */}
                        <div className="grid grid-cols-2 gap-6 max-[769px]:grid-cols-1">
                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label htmlFor="full_name" className="text-sm font-semibold text-gray-900 mb-2">
                                    Full Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="full_name"
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className="p-3 border border-gray-300 rounded bg-white outline-none focus:border-blue-500 disabled:bg-gray-200"
                                    disabled={isSubmitting}
                                    aria-label="Full name input"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col">
                                <label htmlFor="phone_number" className="text-sm font-semibold text-gray-900 mb-2">
                                    Phone Number <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="phone_number"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    className="p-3 border border-gray-300 rounded bg-white outline-none focus:border-blue-500 disabled:bg-gray-200"
                                    disabled={isSubmitting}
                                    aria-label="Phone number input"
                                />
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col">
                                <label htmlFor="email_address" className="text-sm font-semibold text-gray-900 mb-2">
                                    Email Address <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="email_address"
                                    type="email"
                                    name="email_address"
                                    value={formData.email_address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                    className="p-3 border border-gray-300 rounded bg-white outline-none focus:border-blue-500 disabled:bg-gray-200"
                                    disabled={isSubmitting}
                                    aria-label="Email address input"
                                />
                            </div>

                            {/* Current Address */}
                            <div className="flex flex-col">
                                <label htmlFor="current_address" className="text-sm font-semibold text-gray-900 mb-2">
                                    Current Address <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="current_address"
                                    type="text"
                                    name="current_address"
                                    value={formData.current_address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your current address"
                                    className="p-3 border border-gray-300 rounded bg-white outline-none focus:border-blue-500 disabled:bg-gray-200"
                                    disabled={isSubmitting}
                                    aria-label="Current address input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Upload Documents Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Documents</h3>
                        <p className="text-sm text-gray-600 mb-6">Attach your resume</p>

                        <div className="grid grid-cols-2 gap-6 max-[769px]:grid-cols-1">
                            {/* Resume Upload */}
                            <div>
                                <label htmlFor="file" className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <img src={icons.resume} alt="Resume icon" /> Resume / CV <span className="text-red-600">*</span>
                                </label>
                                <label
                                    htmlFor="file"
                                    className="border-2 border-dashed border-gray-400 bg-blue-50 rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center hover:bg-blue-100 transition"
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Click to upload or drag and drop resume"
                                >
                                    <span className="text-3xl mb-2"><img src={icons.drag_drop} alt="" /></span>
                                    <span className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</span>
                                    <span className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</span>
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    name="files"
                                    accept="application/pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    aria-label="File input for resume upload"
                                />
                                {formData.resume && (
                                    <p className="text-sm text-green-600 mt-2">✓ {formData.resume.name}</p>
                                )}
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label htmlFor="cover_letter" className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <img src={icons.cover_letter} alt="Cover letter icon" /> Cover Letter <span className="text-gray-400">(Optional)</span>
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
                </div>

                {/* Footer with Button */}
                <div className="flex justify-center gap-3 p-6 max-[769px]:flex-col max-[769px]:p-4">
                    <button
                        onClick={handleContinue}
                        disabled={isSubmitting}
                        className={`px-10 py-1 text-white font-semibold cursor-pointer transition ${
                            isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 cursor-not-allowed'
                        }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    // Review Step
    if (currentStep === 'review') {
        return (
            <ReviewApplication 
                applicationData={formData}
                onSubmit={handleSubmitApplication}
                onBack={handleBack}
                isSubmitting={isSubmitting}
            />
        );
    }
};

export default Apply;