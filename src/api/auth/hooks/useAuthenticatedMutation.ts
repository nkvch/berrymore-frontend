import { MutateFunction, UseMutationOptions, useMutation } from '@tanstack/react-query';
import getJwtExpDate from '../../../utils/getJwtExpDate';
import refreshToken from '../resfreshToken';
import useLogout from './useLogout';

const useAuthenticatedMutation = <TD, TE, TV>(
  options: UseMutationOptions<TD, TE, TV> & {
    mutationFn: MutateFunction<TD, TE, TV>;
  }
) => {
  const logout = useLogout();

  const modifiedMutationFn = async (variables: TV) => {
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

    return options.mutationFn(variables);
  }

  const useMutationResult = useMutation<TD, TE, TV>({
    ...options,
    mutationFn: modifiedMutationFn,
  });

  return useMutationResult;
};

export default useAuthenticatedMutation;
