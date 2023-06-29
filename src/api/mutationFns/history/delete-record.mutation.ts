import authFetch from "../../auth/helpers/authFetch"
import config from "../../config"

const url = `${config.baseUrl}/history/:id}`

const deleteHistoryRecord = async (id: number) => {
  const response = await authFetch(url.replace(':id', id.toString()), {
    method: 'DELETE'
  })

  return response.json();
}

export default deleteHistoryRecord
