import authFetch from "../auth/helpers/authFetch";
import config from "../config";

const url = `${config.baseUrl}/stats`;

export interface StatsResponse {
  top10Employees: {
    id: number;
    firstName: string;
    lastName: string;
    amount: number;
  }[];
  totalAmount: number;
}

const getLatestStats = async (params: {
  productId?: number;
  foremanId?: number;
}): Promise<StatsResponse> => {
  const urlWithParams = new URL(url);

  if (params.productId) {
    urlWithParams.searchParams.append('productId', params.productId.toString());
  }

  if (params.foremanId) {
    urlWithParams.searchParams.append('foremanId', params.foremanId.toString());
  }

  const response = await authFetch(urlWithParams.toString());

  const data = await response.json() as StatsResponse;

  return data;
}

export default getLatestStats;
