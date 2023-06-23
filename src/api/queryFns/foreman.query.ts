import authFetch from "../auth/helpers/authFetch";
import config from "../config";

const url = `${config.baseUrl}/users/foremen/:id`;

export interface ForemanResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ForemanRequestParams {
  id: number;
}

const getForeman = async ({ id }: ForemanRequestParams) => {
  const urlWithParams = new URL(url.replace(':id', id.toString()));

  const response = await authFetch(urlWithParams.toString());

  const data: ForemanResponse = await response.json();

  return data;
}

export default getForeman;
