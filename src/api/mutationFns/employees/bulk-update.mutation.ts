import { MutationFunction } from '@tanstack/react-query';
import authFetch from '../../auth/helpers/authFetch';
import config from '../../config';

const url = `${config.baseUrl}/employees/bulk`;

export interface BulkUpdateEmployeesDto {
  ids: number[];
  setFlags: number[];
  removeFlags: number[];
}

export type BulkUpdateEmployeesResponse = {
  id: number;
}[];

const bulkUpdateEmployeesMutationFn: MutationFunction<BulkUpdateEmployeesResponse, BulkUpdateEmployeesDto> = async (
  dto: BulkUpdateEmployeesDto
) => {
  const response = await authFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(dto),
  });

  const data: BulkUpdateEmployeesResponse = await response.json();

  return data;
};

export default bulkUpdateEmployeesMutationFn;
