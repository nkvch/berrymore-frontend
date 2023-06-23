import { MutationFunction } from "@tanstack/react-query";
import config from "../config";
import authFetch from "../auth/helpers/authFetch";

const url = `${config.baseUrl}/users/foremen/:id`;

export interface UpdateForemanResponse {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UpdateForemanRequest {
  id: number;
  firstName: string;
  lastName: string;
}

const updateForeman: MutationFunction<UpdateForemanResponse, UpdateForemanRequest> = async ({
  id,
  firstName,
  lastName,
}) => {
  const urlWithParams = new URL(url.replace(':id', id.toString()));

  const response = await authFetch(urlWithParams, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      firstName,
      lastName,
    }),
  });

  const data: UpdateForemanResponse = await response.json();

  return data;
}

export default updateForeman;
