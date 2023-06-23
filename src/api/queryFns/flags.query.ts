import authFetch from "../auth/helpers/authFetch";
import config from "../config"
import { PaginatedResponse, PaginationParams } from "../types/pagination";

const url = `${config.baseUrl}/flags`;

export interface FlagItem {
  id: number;
  name: string;
  color: string;
}

type GetFlagsResponse = PaginatedResponse<FlagItem>;

const getFlags = async (search: string, pagParams: PaginationParams) => {
  const urlWithParams = new URL(url);
  urlWithParams.searchParams.append('page', pagParams.page.toString());
  urlWithParams.searchParams.append('perPage', pagParams.perPage.toString());

  const response = await authFetch(urlWithParams.toString());

  const data: GetFlagsResponse = await response.json();

  return data;
}

export default getFlags;
