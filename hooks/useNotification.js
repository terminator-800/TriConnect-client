import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useNotification(role) {
  return useQuery({
    queryKey: ['notifications', role],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/${role}/notification`, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: 'always',
  });
}

export function useSeenNotifications(role, mutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification_id) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/${role}/notification/${notification_id}/seen`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', role] });
    },
    ...mutationOptions,
  });
}
