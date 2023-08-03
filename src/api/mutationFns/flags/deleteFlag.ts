import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

const url = `${config.baseUrl}/flags/:id`;

export default async function deleteFlag(id: number) {
  const response = await authFetch(url.replace(':id', id.toString()), {
    method: 'DELETE',
  });

  return response.json();
}
