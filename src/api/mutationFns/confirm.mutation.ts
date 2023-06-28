import { MutationFunction } from "@tanstack/react-query";
import config from "../config";
import fetchWithThrow from "../../helpers/fetchWithThrow";

const url = `${config.baseUrl}/auth/verify`;

export interface VerifyResponse {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roleName: 'admin' | 'owner' | 'foreman';
}

export interface VerifyRequest {
  token: string;
}

const confirm: MutationFunction<VerifyResponse, VerifyRequest> = async ({ token }) => {
  const response = await fetchWithThrow(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ token }),
  });

  const data: VerifyResponse = await response.json();

  return data;
}

export default confirm;
