import { MutationFunction } from "@tanstack/react-query";
import config from "../config";
import authFetch from "../auth/helpers/authFetch";

const url = `${config.baseUrl}/users/foremen`;

export interface AddForemanResponse {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
}

export interface AddForemanRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email?: string;
}

const addForeman: MutationFunction<AddForemanResponse, AddForemanRequest> = async ({
  firstName,
  lastName,
  username,
  password,
  email,
}) => {
  const response = await authFetch(url, {
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

  const data: AddForemanResponse = await response.json();

  return data;
}

export default addForeman;
