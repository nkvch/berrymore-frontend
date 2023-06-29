import authFetch from "../auth/helpers/authFetch"
import config from "../config"

const url = `${config.baseUrl}/employees/has-any-data/:id`;

interface CheckEmployeeDataResponse {
  hasShifts: boolean;
  hasHistory: boolean;
}

const checkEmployeeData = async (employeeId: number) => {
  const response = await authFetch(url.replace(':id', employeeId.toString()), {
    method: 'GET',
  });

  const data: CheckEmployeeDataResponse = await response.json();

  return data;
}

export default checkEmployeeData;
