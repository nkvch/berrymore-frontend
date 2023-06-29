import authFetch from "../auth/helpers/authFetch";
import config from "../config";
import { PaginatedResponse, PaginationParams } from "../types/pagination";

interface HistoryQuery {
  fromDateTime?: Date;
  toDateTime?: Date;
  foremanId?: number;
  productId?: number;
  employeeId?: number;
  sort: 'asc' | 'desc';
}

export interface HistoryItem {
  id: number;
  dateTime: string;
  amount: number;
  isPaid: boolean;
  products: {
    id: number;
    productName: string;
    ownerId: number;
  };
  employees: {
    id: number;
    firstName: string;
    lastName: string;
    foreman: {
      id: number;
      firstName: string;
      lastName: string;
      ownerId: number;
    };
    ownerId: number;
  };
  ownerId: number;
}

const url = `${config.baseUrl}/history`;

const getHistory = async (query: HistoryQuery, pagParams: PaginationParams): Promise<PaginatedResponse<HistoryItem>> => {
  const urlWithParams = new URL(url);

  if (query.fromDateTime) {
    urlWithParams.searchParams.append('fromDateTime', query.fromDateTime.toISOString());
  }

  if (query.toDateTime) {
    urlWithParams.searchParams.append('toDateTime', query.toDateTime.toISOString());
  }

  if (query.foremanId) {
    urlWithParams.searchParams.append('foremanId', query.foremanId.toString());
  }

  if (query.productId) {
    urlWithParams.searchParams.append('productId', query.productId.toString());
  }

  if (query.employeeId) {
    urlWithParams.searchParams.append('employeeId', query.employeeId.toString());
  }

  urlWithParams.searchParams.append('sort', query.sort);
  urlWithParams.searchParams.append('page', pagParams.page.toString());
  urlWithParams.searchParams.append('limit', pagParams.perPage.toString());

  const response = await authFetch(urlWithParams.toString());

  const data = await response.json() as PaginatedResponse<HistoryItem>;

  return data;
}

export default getHistory;
