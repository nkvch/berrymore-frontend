import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

export interface MarkAsPaidPeriodData {
  employeeId: number;
  productId?: number;
  fromDateTime?: Date;
  toDateTime?: Date;
}

const url = `${config.baseUrl}/history/mark-as-paid`;

const markAsPaid = async (data: MarkAsPaidPeriodData) => {
  const response = await authFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  return response.json();
}

export default markAsPaid;
