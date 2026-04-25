import { useQuery } from '@tanstack/react-query';
import api from '../../../../../api/axios.js';

export const PENDING_DEPLOYMENTS_QUERY_KEY = ['administrator', 'deployments', 'pending'];

export function usePendingDeployments() {
  return useQuery({
    queryKey: PENDING_DEPLOYMENTS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get('/administrator/deployments/pending');
      return res.data.deployments ?? [];
    },
  });
}
