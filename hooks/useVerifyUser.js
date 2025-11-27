import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/verify/user/${userId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submittedUsers'] });
    },
    onError: () => {
      alert('Something went wrong while verifying the user.');
    },
  });
}
