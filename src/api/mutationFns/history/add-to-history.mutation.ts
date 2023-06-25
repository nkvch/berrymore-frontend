import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

const url = `${config.baseUrl}/history`;

export interface AddToHistoryData {
  employeeId: number;
  productId: number;
  dateTime: Date;
  amount: string;
}

const addToHistoryMutation = async (data: AddToHistoryData): Promise<void> => {
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export default addToHistoryMutation;
