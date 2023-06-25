import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

export interface AddShiftMutationDto {
  employeeIds: number[]
  startDate: Date
  endDate: Date
}

const url = `${config.baseUrl}/shifts`;

const addShift = async (params: AddShiftMutationDto) => {
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  return response.json();
}

export default addShift;
