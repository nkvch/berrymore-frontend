import authFetch from "../auth/helpers/authFetch";
import config from "../config"
import { SignInResponse } from "../mutationFns/signin.mutation";

const url = `${config.baseUrl}/auth/me`;

export type User = Omit<SignInResponse, 'token'>;

const getMe = async () => {
  const response = await authFetch(url);

  const data: User = await response.json();

  return data;
}

export default getMe;
