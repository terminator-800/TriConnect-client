import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ROLE } from '../utils/role';
import axios from 'axios';

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ application_id, applicant_id, role = ROLE.BUSINESS_EMPLOYER }) => {
      const prefix =
        role === ROLE.INDIVIDUAL_EMPLOYER
          ? '/individual-employer'
          : role === ROLE.MANPOWER_PROVIDER
            ? '/manpower-provider'
            : '/business-employer';

      const isManpowerProvider = role === ROLE.MANPOWER_PROVIDER;

      // ✅ Determine URL and body based on what data is available
      let url;
      let body = {};

      if (application_id) {
        // Has application_id - use the standard route with ID in path
        url = `${import.meta.env.VITE_API_URL}${prefix}/applications/${application_id}/reject`;
      } else if (isManpowerProvider && applicant_id) {
        // Manpower provider without application_id - use body-based route
        url = `${import.meta.env.VITE_API_URL}${prefix}/applications/reject`;
        body = { applicant_id };
      } else {
        // Invalid - no valid ID provided
        throw new Error('Missing application_id or applicant_id');
      }

      console.log('🚀 Rejection request:', { url, body, application_id, applicant_id, role });

      const response = await axios.patch(url, body, { withCredentials: true });
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      alert('Applicant rejected successfully.');
    },
    
    onError: (error) => {
      console.log('Full error:', error);
      console.log('Error details:', error.response?.data);
    }
  });
};