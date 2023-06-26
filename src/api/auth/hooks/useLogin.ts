import { useRecoilCallback } from "recoil";
import authState from "../../../recoil/authState";
import { SignInResponse } from "../../mutationFns/signin.mutation";

const useLogin = () => {
  return useRecoilCallback(({ set }) => ({ token, ...user }: SignInResponse) => {
    localStorage.setItem('jwt', token);
    set(authState, { user, isPending: false });
  });
}

export default useLogin;
