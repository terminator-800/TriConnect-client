import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`/logout`, {}, { withCredentials: true });

      if (response.status === 200) {
        localStorage.removeItem('token');
        queryClient.invalidateQueries(); // Invalidate all queries
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed. Please try again.');
      localStorage.removeItem('token');
      queryClient.invalidateQueries(); // Invalidate all queries
    } finally {
      localStorage.removeItem('token');
      setIsLoading(false);
    }
  }, [navigate, queryClient]);

  return { logout, isLoading, error };
};
