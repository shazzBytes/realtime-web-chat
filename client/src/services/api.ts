const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiOptions = RequestInit & {
  body?: BodyInit | null;
};

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : options.body
          ? { "Content-Type": "application/json" }
          : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request failed (${response.status})`,
    );
  }

  return data as T;
}