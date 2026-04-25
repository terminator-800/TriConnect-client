import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/manpower-provider/team-members`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manpowerTeamMembers'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.error || 'Failed to add team member.';
      alert(msg);
    },
  });
};
