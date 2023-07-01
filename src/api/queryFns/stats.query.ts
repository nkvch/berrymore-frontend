import authFetch from "../auth/helpers/authFetch";
import config from "../config";

const url = `${config.baseUrl}/stats`;

export interface StatsResponse {
  topEmployees: {
    id: number;
    firstName: string;
    lastName: string;
    amount: number;
  }[];
  totalAmount: number;
  unpaid: {
    amount: number;
    pay: number;
  };
}

const getLatestStats = async (params: {
  productId?: number;
  foremanId?: number;
  fromDateTime: Date;
  toDateTime: Date;
}): Promise<StatsResponse> => {
  const urlWithParams = new URL(url);

  if (params.productId) {
    urlWithParams.searchParams.append('productId', params.productId.toString());
  }

  if (params.foremanId) {
    urlWithParams.searchParams.append('foremanId', params.foremanId.toString());
  }

  urlWithParams.searchParams.append('fromDateTime', params.fromDateTime.toISOString());
  urlWithParams.searchParams.append('toDateTime', params.toDateTime.toISOString());

  const response = await authFetch(urlWithParams.toString());

  const data = await response.json() as StatsResponse;

  return data;
}

export default getLatestStats;
