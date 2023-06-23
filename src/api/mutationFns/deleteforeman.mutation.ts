import { MutateFunction } from "@tanstack/react-query";
import authFetch from "../auth/helpers/authFetch";
import config from "../config";

const url = `${config.baseUrl}/users/foremen/:id`;

export interface DeleteForemanMutationVariables {
  id: number;
}

const deleteForemanMutationFn: MutateFunction<unknown, Error, DeleteForemanMutationVariables> = async (arg) => {
  const response = await authFetch(url.replace(':id', arg.id.toString()), {
    method: 'DELETE',
  });

  const data = await response.json();

  return data;
}

export default deleteForemanMutationFn;
