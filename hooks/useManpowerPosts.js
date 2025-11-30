import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useManpowerPosts = (role) =>
  useQuery({
    queryKey: ['manpowerPosts'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/${role}/manpower-posts`, {
          withCredentials: true,
        });

        return response.data;
      } catch (error) {
        alert('Failed to fetch manpower job posts. Please try again later.');
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 min cache
    retry: 1,
    refetchOnWindowFocus: false,
  });
