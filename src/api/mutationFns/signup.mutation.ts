import { MutationFunction } from "@tanstack/react-query";
import config from "../config";

const url = `${config.baseUrl}/auth/signup`;

export interface SignUpResponse {
  message: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

const signUp: MutationFunction<SignUpResponse, SignUpRequest> = async ({
  firstName,
  lastName,
  username,
  password,
  email,
}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      username,
      password,
      email,
    }),
  });

  const data: SignUpResponse = await response.json();

  return data;
}

export default signUp;
