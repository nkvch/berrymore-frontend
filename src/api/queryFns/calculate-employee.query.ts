import authFetch from "../auth/helpers/authFetch";
import config from "../config";

export interface CalculateEmployeeParams {
  productId?: number;
  fromDateTime?: Date;
  toDateTime?: Date;
}

export interface CalculateEmployeeQueryResult {
  totalAmount: number;
  totalPay: number;
  products: {
    id: number;
    name: string;
    amount: number;
    pay: number;
  }[];
}

const url = `${config.baseUrl}/stats/calc/:id`;

const calculateEmployee = async (employeeId: number, params: CalculateEmployeeParams) => {
  const urlWithParams = new URL(url.replace(':id', employeeId.toString()));

  if (params.productId) {
    urlWithParams.searchParams.append('productId', params.productId.toString());
  }

  if (params.fromDateTime) {
    urlWithParams.searchParams.append('fromDateTime', params.fromDateTime.toISOString());
  }

  if (params.toDateTime) {
    urlWithParams.searchParams.append('toDateTime', params.toDateTime.toISOString());
  }

  const response = await authFetch(urlWithParams.toString());

  const result = await response.json() as CalculateEmployeeQueryResult;

  return result;
}

export default calculateEmployee;
