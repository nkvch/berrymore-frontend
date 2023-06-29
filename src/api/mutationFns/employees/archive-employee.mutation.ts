import authFetch from "../../auth/helpers/authFetch";
import config from "../../config"

const url = `${config.baseUrl}/employees/archive/:id`;

const archiveEmployee = async (employeeId: number) => {
  const response = await authFetch(url.replace(':id', employeeId.toString()), {
    method: 'PUT'
  });

  return response.json()
};

export default archiveEmployee
