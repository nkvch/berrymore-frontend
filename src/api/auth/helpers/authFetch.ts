import fetchWithThrow from "../../../helpers/fetchWithThrow";

const authFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const jwt = localStorage.getItem('jwt');

  const response = await fetchWithThrow(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${jwt}`
    }
  });

  return response;
}

export default authFetch;
