import { ROLE_LABELS, getInitials } from '../../../../../utils/role';
import { useEffect } from 'react';

const ViewFeedback = ({ feedback, onClose }) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (!feedback) return null;

    const { profile, name, type, color, date, message } = feedback;

    return (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center ml-55">
            <div className="p-8 shadow-lg max-w-3xl w-full relative backdrop-blur-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-5 absolute top-4 right-8 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold cursor-pointer hover:bg-red-600 transition"
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

                <div className="flex items-center gap-4 mb-4">

                    {/* PROFILES */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile ? (
                            <img
                                src={profile}
                                alt={name || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-bold text-gray-600 italic text-center">
                                {getInitials(name) || "n/a"}
                            </span>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold italic">{name}</h2>
                        <p className={`font-bold italic ${color}`}>{ROLE_LABELS[type]}</p>
                    </div>

                </div>

                <p className="text-sm text-gray-500 mb-2">Submitted on: {date}</p>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-bold mb-2">Feedback</h3>
                    <div className="text-gray-800 whitespace-pre-line max-h-60 min-h-60 overflow-y-auto pr-2 hide-scrollbar">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedback;
