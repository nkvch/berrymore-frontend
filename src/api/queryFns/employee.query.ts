import authFetch from "../auth/helpers/authFetch";
import config from "../config";

interface Employee {
  id: number;
  contract: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  additionalInfo: string;
  photoPath: string | null;
  foremanId: number;
  foreman: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  flags: {
    id: number;
    name: string;
    color: string;
    ownerId: number;
  }[];
  ownerId: number;
}

const url = `${config.baseUrl}/employees/:id`;

const getEmployeeById = async (id: number) => {
  const response = await authFetch(url.replace(':id', id.toString()));

  const employee: Employee = await response.json();

  return employee;
}

export default getEmployeeById;
