import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../../../../../utils/role';

export const useFetchChartData = () => {
  return useFetchChartDataByPeriod('daily');
};

export const useFetchChartDataByPeriod = (period = 'daily') => {
  return useQuery({
    queryKey: ['chartData', period],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/chart-data`,
        {
          params: { period: String(period).toLowerCase() },
          withCredentials: true,
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: 'always',
  });
};
