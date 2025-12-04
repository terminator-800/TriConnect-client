import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ROLE } from '../../../../../utils/role';

export const useFetchEnrolledEmployers = () => {
  return useQuery({
    queryKey: ['enrolledEmployers'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/${ROLE.ADMINISTRATOR}/enrolled-employers`,
        { withCredentials: true }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: 'always',
  });
};