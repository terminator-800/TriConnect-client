import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../../../../../utils/role';

export const useFetchSuccessfulHires = () => {
  return useQuery({
    queryKey: ['successfulHires'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/successful-hires`,
        { withCredentials: true }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: 'always',
  });
};