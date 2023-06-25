import authFetch from "../auth/helpers/authFetch";
import config from "../config"
import { PaginatedResponse, PaginationParams } from "../types/pagination";

const url = `${config.baseUrl}/users/foremen`;

export interface ForemanTableItem extends Record<string, string | number> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

type GetForemenResponse = PaginatedResponse<ForemanTableItem>;

const getForemen = async (search: string, pagParams: PaginationParams) => {
  const urlWithParams = new URL(url);
  urlWithParams.searchParams.append('page', pagParams.page.toString());
  urlWithParams.searchParams.append('perPage', pagParams.perPage.toString());

  const response = await authFetch(urlWithParams.toString());

  const data: GetForemenResponse = await response.json();

  return data;
}

export default getForemen;
