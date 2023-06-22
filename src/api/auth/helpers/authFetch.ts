const authFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const jwt = localStorage.getItem('jwt');

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${jwt}`
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

export default authFetch;
