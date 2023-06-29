import authFetch from "../../auth/helpers/authFetch"
import config from "../../config"

const url = `${config.baseUrl}/employees/all-data/:id`

const deleteAllEmployeeData = async (employeeId: number) => {
  const response = await authFetch(url.replace(':id', employeeId.toString()), {
    method: 'DELETE'
  })

  return response.json()
}

export default deleteAllEmployeeData
