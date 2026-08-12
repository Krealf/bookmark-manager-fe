export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('No connection to server.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Server error' }));

    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
};
