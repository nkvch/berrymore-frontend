import authFetch from '../../auth/helpers/authFetch';
import config from '../../config';

const url = `${config.baseUrl}/flags`;

export interface Flag {
  name: string;
  color: string;
}

export default async function addFlag(data: Flag) {
  const response = await authFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  return response.json();
}
