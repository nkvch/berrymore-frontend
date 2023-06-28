const fetchWithThrow = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    const json = await response.json();

    throw new Error(
      Array.isArray(json.message) ? json.message.join(', ') : json.message
    );
  }

  return response;
}

export default fetchWithThrow;
