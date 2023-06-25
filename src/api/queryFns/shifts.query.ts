import authFetch from "../auth/helpers/authFetch";
import config from "../config";

const url = `${config.baseUrl}/shifts`;

export interface getShiftsParams {
  from?: Date | null;
  to?: Date | null;
  employeeId?: number | null;
}

export interface Shift {
  id: number;
  startDate: string;
  endDate: string;
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
    photoPath: string | null;
    ownerId: number;
  };
}

const getShifts = async (params: getShiftsParams) => {
  const { from, to, employeeId } = params;

  const urlParams = new URLSearchParams();

  if (from) {
    urlParams.append('from', from.toISOString());
  }

  if (to) {
    urlParams.append('to', to.toISOString());
  }

  if (employeeId) {
    urlParams.append('employeeId', employeeId.toString());
  }

  const response = await authFetch(`${url}?${urlParams.toString()}`);

  return response.json() as Promise<Shift[]>;
}

export default getShifts;
