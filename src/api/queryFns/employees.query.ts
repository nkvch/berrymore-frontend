import authFetch from "../auth/helpers/authFetch";
import config from "../config"
import { PaginatedResponse, PaginationParams } from "../types/pagination";

const url = `${config.baseUrl}/employees`;

export interface EmployeeTableItem {
  id: number;
  firstName: string;
  lastName: string;
  berryId: string;
  contract: string;
  phone: string;
  address: string;
  additionalInfo: string;
  photoPath: string | null;
  flags: {
    id: number;
    name: string;
    color: string;
  }[];
  foreman: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
}

export interface EmployeesRequestParams {
  search?: string;
  flagsPresent?: number[];
  flagsAbsent?: number[];
  foremanId?: number;
}

type GetEmployeesResponse = PaginatedResponse<EmployeeTableItem>;

const getEmployees = async (params: EmployeesRequestParams, pagParams: PaginationParams) => {
  const urlWithParams = new URL(url);

  if (params.search) {
    urlWithParams.searchParams.append('search', params.search);
  }

  if (params.flagsPresent) {
    urlWithParams.searchParams.append('flagsPresent', params.flagsPresent.join(','));
  }

  if (params.flagsAbsent) {
    urlWithParams.searchParams.append('flagsAbsent', params.flagsAbsent.join(','));
  }

  if (params.foremanId) {
    urlWithParams.searchParams.append('foremanId', params.foremanId.toString());
  }

  urlWithParams.searchParams.append('page', pagParams.page.toString());
  urlWithParams.searchParams.append('perPage', pagParams.perPage.toString());

  const response = await authFetch(urlWithParams.toString());

  const data: GetEmployeesResponse = await response.json();

  return data;
}

export default getEmployees;
