import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth';

export const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['auth'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    retry: false,
    refetchOnWindowFocus: false, // avoid refetch on tab switch
  });

  return {
    user: data?.user,
    isLoading,
    error,
    isAuthenticated: !!data?.user,
  };
};
