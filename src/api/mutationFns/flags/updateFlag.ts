import authFetch from '../../auth/helpers/authFetch';
import config from '../../config';

const url = `${config.baseUrl}/flags/:id`;

export default async function updateFlag(data: {
  id: number;
  name: string;
  color: string;
}) {
  const { id, ...rest } = data;
  const response = await authFetch(url.replace(':id', id.toString()), {
    method: 'PUT',
    body: JSON.stringify(rest),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  return response.json();
}
