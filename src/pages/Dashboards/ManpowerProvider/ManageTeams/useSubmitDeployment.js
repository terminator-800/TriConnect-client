import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../../api/axios.js';

export function useSubmitDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, receiptFile }) => {
      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));
      fd.append('receipt', receiptFile);
      const response = await api.post('/manpower-provider/deployments', fd);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manpowerTeamMembers'] });
    },
  });
}
