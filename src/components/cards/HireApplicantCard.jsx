import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import socket  from '../../../utils/socket'; 

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (err) {
    console.error('Invalid date format:', dateString);
    return dateString;
  }
};

export const HireApplicantCard = ({ msg, isSender }) => {
  const queryClient = useQueryClient();
  
  const {
    job_title,
    employer_name,
    full_name,
    hire_message,
    start_date,
    end_date,
    message_id,
    conversation_id,
    hire_status,
  } = msg;
  
  // Initialize status based on hire_status from hires table
  const getInitialStatus = () => {
    if (hire_status === 'accepted' || hire_status === 'active') return 'accepted';
    if (hire_status === 'rejected') return 'declined';
    return 'pending';
  };

  const [status, setStatus] = useState(getInitialStatus());

    useEffect(() => {
    if (!conversation_id) return;

    socket.emit("joinRoom", `conversation-${conversation_id}`);

    return () => {
      socket.emit("leaveRoom", `conversation-${conversation_id}`);
    };
  }, [conversation_id]);

  // React Query mutation for accepting job offer
  const acceptMutation = useMutation({
    mutationFn: async (offerData) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${msg.receiver_role}/accept-offer`, 
        offerData,
        { withCredentials: true }
      );
      return response.data;
    },
    onMutate: async (offerData) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries(['messages', conversation_id]);
      await queryClient.cancelQueries(['conversations']);
      
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['messages', conversation_id]);
      
      // Optimistically update the message status in cache
      queryClient.setQueryData(['messages', conversation_id], (old) => {
        if (!old) return old;
        return old.map(message => 
          message.message_id === message_id 
            ? { ...message, hire_status: 'accepted' }
            : message
        );
      });
      
      // Return context with previous data for rollback
      return { previousMessages };
    },
    onSuccess: (data) => {
      console.log('Accept success:', data);
      setStatus('accepted');
      
      // Invalidate and refetch to sync with server
      queryClient.invalidateQueries(['messages', conversation_id]);
      queryClient.invalidateQueries(['conversations']);
      
      // Optional: Emit WebSocket event if you have socket.io setup
      socket.emit('offer-accepted', {
        conversation_id,
        message_id,
        hire_status: 'accepted'
      });
    },
    onError: (error, variables, context) => {
      // Rollback to previous data on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversation_id], context.previousMessages);
      }
      
      setStatus('error');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries(['messages', conversation_id]);
    },
  });

  // React Query mutation for declining job offer
  const declineMutation = useMutation({
    mutationFn: async (offerData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${msg.receiver_role}/decline-offer`, 
        offerData,
        { withCredentials: true }
      );
      return response.data;
    },
    onMutate: async (offerData) => {
      await queryClient.cancelQueries(['messages', conversation_id]);
      
      const previousMessages = queryClient.getQueryData(['messages', conversation_id]);
      
      queryClient.setQueryData(['messages', conversation_id], (old) => {
        if (!old) return old;
        return old.map(message => 
          message.message_id === message_id 
            ? { ...message, hire_status: 'rejected' }
            : message
        );
      });
      
      return { previousMessages };
    },
    onSuccess: (data) => {
      setStatus('declined');
      
      queryClient.invalidateQueries(['messages', conversation_id]);
      queryClient.invalidateQueries(['conversations']);
    },
    onError: (error, variables, context) => {
      
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversation_id], context.previousMessages);
      }
      
      setStatus('error');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['messages', conversation_id]);
    },
  });

  const handleAccept = () => {
    const offerData = {
      job_title,
      employer_name,
      full_name,
      start_date,
      end_date,
      accepted_at: new Date().toISOString(),
      message_id,
      conversation_id,
    };
    acceptMutation.mutate(offerData);
  };

  const handleDecline = () => {
    const offerData = {
      job_title,
      employer_name,
      full_name,
      start_date,
      end_date,
      declined_at: new Date().toISOString(),
      message_id,
      conversation_id,
    };
    declineMutation.mutate(offerData);
  };

  const formattedStartDate = formatDate(start_date);
  const formattedEndDate = formatDate(end_date);

  // Check if any required field is empty
  const hasEmptyFields =
    !job_title ||
    !employer_name ||
    !full_name ||
    !hire_message ||
    !end_date ||
    !start_date;

  if (hasEmptyFields) {
    return (
      <div className="w-full max-w-lg px-4 py-3 bg-red-50 border border-red-300 rounded-lg">
        <p className="text-red-700 text-sm font-semibold">⚠️ Incomplete Hire Offer</p>
        <p className="text-red-600 text-xs mt-1">Some required fields are missing.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
      {/* Content */}
      <div className="px-8 py-8 space-y-6">
        {/* Greeting */}
        <p className="text-gray-800 text-base leading-relaxed">
          Hi [{full_name}],
        </p>

        {/* Job Selection Message */}
        <p className="text-gray-800 text-base leading-relaxed">
          You have been selected for the position of [{job_title}] at [{employer_name}].
        </p>

        {/* Important Notice */}
        <p className="text-gray-800 text-base leading-relaxed">
          By <span className="font-bold">accepting this offer</span>, your account will be{' '}
          <span className="font-bold">temporarily disabled</span> from [{formattedStartDate}] until [{formattedEndDate}]. 
          This means you will <span className="font-bold">not be able to apply for other jobs or access job-seeking features</span> during your employment.
        </p>

        {/* Reactivation Notice */}
        <p className="text-gray-800 text-base leading-relaxed">
          Your account will be <span className="font-bold">automatically reactivated</span> once your employment/contract period ends.
        </p>

        {/* Question */}
        <p className="text-gray-800 text-base leading-relaxed">
          Do you accept this job offer?
        </p>

        {/* Action Buttons */}
        {status === 'pending' && !isSender && (
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={handleAccept}
              disabled={acceptMutation.isPending || declineMutation.isPending}
              className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              disabled={acceptMutation.isPending || declineMutation.isPending}
              className="px-12 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-base rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
          </div>
        )}

        {/* Status Messages */}
        {acceptMutation.isPending && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 text-center">
            <p className="text-blue-700 font-semibold">⏳ Accepting offer...</p>
          </div>
        )}

        {declineMutation.isPending && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 text-center">
            <p className="text-blue-700 font-semibold">⏳ Declining offer...</p>
          </div>
        )}

        {status === 'accepted' && (
          <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 text-center">
            <p className="text-green-700 font-semibold">✓ {isSender ? 'Job offer accepted by applicant' : 'You have accepted this job offer'}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-center">
            <p className="text-red-700 font-semibold">✗ Error processing offer. Please try again.</p>
          </div>
        )}

        {status === 'declined' && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-center">
            <p className="text-red-700 font-semibold">✗ {isSender ? 'Job offer declined by applicant' : 'You have declined this job offer'}</p>
          </div>
        )}

        {/* Sender View - Pending */}
        {isSender && status === 'pending' && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 text-center">
            <p className="text-blue-700 text-sm">Job offer sent. Waiting for response...</p>
          </div>
        )}
      </div>
    </div>
  );
};