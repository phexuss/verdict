export type ErrorType<ErrorData = unknown> = Error & {
  info?: ErrorData;
  status?: number;
};

export type BodyType<BodyData> = BodyData;

export async function customFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
  });
  const body = [204, 205, 304].includes(response.status)
    ? null
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      `Request failed with ${response.status}`,
    ) as ErrorType;

    error.info = parseBody(body) ?? undefined;
    error.status = response.status;

    throw error;
  }

  const data = parseBody(body);

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}

function parseBody(body: string | null) {
  if (!body) {
    return undefined;
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    return body;
  }
}
