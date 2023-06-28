import { MutationFunction } from "@tanstack/react-query";
import config from "../config";
import fetchWithThrow from "../../helpers/fetchWithThrow";

const url = `${config.baseUrl}/auth/signin`;

export interface SignInResponse {
  email: string;
  username: string;
  token: string;
  firstName: string;
  lastName: string;
  roleName: 'admin' | 'owner' | 'foreman';
}

const signIn: MutationFunction<SignInResponse, {
  username: string;
  password: string;
}> = async ({ username, password }) => {
  const response = await fetchWithThrow(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ username, password }),
  });

  const data: SignInResponse = await response.json();

  return data;
}

export default signIn;
