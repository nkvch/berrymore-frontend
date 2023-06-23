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
    const json = await response.json();

    throw new Error(
      Array.isArray(json.message) ? json.message.join(', ') : json.message
    );
  }

  return response;
}

export default authFetch;
