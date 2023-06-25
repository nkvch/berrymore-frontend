import authFetch from "../../auth/helpers/authFetch"
import config from "../../config"

const url = `${config.baseUrl}/shifts/cut-out-period`;

export interface CutOutPeriodRequest {
  employeeIds?: number[]
  startDate: Date
  endDate: Date
}

const cutOutPeriod = async (request: CutOutPeriodRequest) => {
  const { employeeIds, startDate, endDate } = request
  const response = await authFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeIds, startDate, endDate }),
  })

  return response.json()
};

export default cutOutPeriod
