import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useNotification(role) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${role}/notification`,
        { withCredentials: true }
      );
      return response.data;
    },
    staleTime: 1000 * 60, 
    refetchInterval: 1000 * 30,
    onSuccess: () => {
      // 🔥 Invalidate the user profile for THIS role
      queryClient.invalidateQueries(['user-profile', role]);
    },
    onError: (error) => {
      console.error('Failed to fetch notifications:', error);
    },
  });
}
