import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const useRejectJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, id }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/administrator/reject/jobpost`, // no :id in URL
        { type, id }, // ✅ send both in body
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingJobPosts']);
    },
    onError: () => {
      alert('Something went wrong while rejecting the job post.');
    },
  });
};
