import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const usePendingJobPosts = () =>
  useQuery({
    queryKey: ['pendingJobPosts'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/pendingJobPosts`,
        { withCredentials: true }
      );
      return response.data;
    },
    refetchOnWindowFocus: 'always',
    staleTime: 1000 * 60,
  });

export const useUnappliedJobPosts = () =>
  useQuery({
    queryKey: ['unappliedJobPosts'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/unappliedJobPosts`, {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useSavedJobPosts = () =>
  useQuery({
    queryKey: ['savedJobPosts'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/savedJobPosts`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useSaveJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPostId) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/savedJobPosts`,
        { job_post_id: jobPostId },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobPosts'] });
      queryClient.invalidateQueries({ queryKey: ['unappliedJobPosts'] });
    },
  });
};

export const useUnsaveJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPostId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/savedJobPosts/${jobPostId}`,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobPosts'] });
      queryClient.invalidateQueries({ queryKey: ['unappliedJobPosts'] });
    },
  });
};

export const useJobPostsByUser = (category) =>
  useQuery({
    queryKey: ['jobPostsByUser', category],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobPosts${category ? `?category=${category}` : ''}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: 'always',
    staleTime: 1000 * 60,
  });

export const useVerifiedJobPosts = () =>
  useQuery({
    queryKey: ['verifiedJobPosts'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/verifiedJobPosts`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    refetchOnWindowFocus: 'always',
    staleTime: 1000 * 60,
  });

export const useEditJobPost = (role) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedJob) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/${role}/edit-job-post/${updatedJob.job_post_id}`,
        updatedJob,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['jobPostsByUser']);
      console.log(`Job post ${variables.job_post_id} updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating job post:', error);
    },
  });
};
