import authFetch from "../auth/helpers/authFetch"
import config from "../config"
import { EmployeeTableItem } from "./employees.query";

const url = `${config.baseUrl}/employees/by-berry-id`;

const getEmployeeByBerryId = async (berryId: string): Promise<EmployeeTableItem> => {
  const urlWithParams = new URL(url);

  urlWithParams.searchParams.append('berryId', berryId);

  const response = await authFetch(urlWithParams.toString());

  return response.json();
}

export default getEmployeeByBerryId;
