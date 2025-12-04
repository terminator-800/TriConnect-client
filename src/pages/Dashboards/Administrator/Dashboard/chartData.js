import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../../../../../utils/role';

export const useFetchChartData = () => {
  return useQuery({
    queryKey: ['chartData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/chart-data`,
        { withCredentials: true }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: 'always',
  });
};
