import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export async function fetchTeamMembers() {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/manpower-provider/team-members`, {
    withCredentials: true,
  });
  return res.data.team_members ?? [];
}

export function useTeamMembers(enabled) {
  return useQuery({
    queryKey: ['manpowerTeamMembers'],
    queryFn: fetchTeamMembers,
    enabled: Boolean(enabled),
  });
}
