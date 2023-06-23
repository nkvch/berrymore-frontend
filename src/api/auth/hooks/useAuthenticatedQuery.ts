import { QueryFunction, QueryFunctionContext, QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import getJwtExpDate from '../../../utils/getJwtExpDate';
import refreshToken from '../resfreshToken';
import useLogout from './useLogout';

function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData?: () => undefined },
) {
  const logout = useLogout();

  const useQueryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>(queryKey, async (context: QueryFunctionContext<TQueryKey, any>) => {
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

    return queryFn(context);
  }, options);

  return useQueryResult;
};

export default useAuthenticatedQuery;
