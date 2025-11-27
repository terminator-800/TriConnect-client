import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateHiringJobPost = (role, onSuccessCallback) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/${role}/job-post`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        },

        onSuccess: (res) => {
            if (res.status === 201) {
                if (onSuccessCallback) onSuccessCallback();
            }
        },

        onError: (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.error;

            if (status === 400 && message?.includes("maximum")) {
                alert("Monthly limit reached. Subscribe to extend to 10 job posts a month.");
            } else if (
                (status === 400 || status === 400) &&
                message?.includes("only create up to")
            ) {
                alert("You’ve reached the limit of 3 active job posts. Please remove an existing one or upgrade your plan to continue.");
            } else {
                alert("An error occurred while creating the job post.");
            }
        }
    });
};


export const useCreateIndividualJobPost = (role, onSuccessCallback) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/${role}/individual-job-post`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        },

        onSuccess: (res) => {
            if (res.status === 201) {
                if (onSuccessCallback) onSuccessCallback();
            }
        },

        onError: (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.error;

            if (status === 400 && message?.includes("maximum")) {
                alert("Monthly limit reached. Subscribe to extend to 10 job posts a month.");
            } else if (
                (status === 400) &&
                message?.includes("only create up to")
            ) {
                alert("You’ve reached the limit of 3 active job posts. Please remove an existing one or upgrade your plan to continue.");
            } else {
                alert("An error occurred while creating the job post.");
            }
        }
    });
};

export const useCreateTeamJobPost = (role, onSuccessCallback) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/${role}/team-job-post`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        },

        onSuccess: (res) => {
            if (res.status === 201) {
                if (onSuccessCallback) onSuccessCallback();
            }
        },

        onError: (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.error;

            if (status === 400 && message?.includes("maximum")) {
                alert("Monthly limit reached. Subscribe to extend your team job posts.");
            } else if (status === 400 && message?.includes("only create up to")) {
                alert("You’ve reached the limit of active team job posts. Please remove an existing one or upgrade your plan to continue.");
            } else {
                alert("An error occurred while creating the team job post.");
            }
        }
    });
};