import { MutateFunction } from "@tanstack/react-query";
import config from "../../config";
import authFetch from "../../auth/helpers/authFetch";

const url = `${config.baseUrl}/employees/:id`;

export interface DeleteEmployeeMutationVariables {
  id: number;
}

const deleteEmployeeMutationFn: MutateFunction<unknown, Error, DeleteEmployeeMutationVariables> = async (arg) => {
  const response = await authFetch(url.replace(':id', arg.id.toString()), {
    method: 'DELETE',
  });

  const data = await response.json();

  return data;
}

export default deleteEmployeeMutationFn;
