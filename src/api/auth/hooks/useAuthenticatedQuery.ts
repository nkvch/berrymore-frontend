import { QueryKey, QueryOptions, useQuery } from '@tanstack/react-query';
import getJwtExpDate from '../../../utils/getJwtExpDate';
import refreshToken from '../resfreshToken';
import useLogout from './useLogout';

function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: QueryOptions<T>
) {
  const logout = useLogout();

  const useQueryResult = useQuery<T>(queryKey, async () => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt || jwt === 'undefined') {
      logout();
    } else {
      const expDate = getJwtExpDate(jwt);

      const isLessThanHour = expDate.getTime() - Date.now() < 1000 * 60 * 60;

      if (isLessThanHour) {
        const newJwt = await refreshToken();

        localStorage.setItem('jwt', newJwt);
      }
    }

    return queryFn();
  }, options);

  return useQueryResult;
};

export default useAuthenticatedQuery;
