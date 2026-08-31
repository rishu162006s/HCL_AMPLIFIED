const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
  } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authToken =
    token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers,
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined,
    }
  );

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authchange"));
    }

    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

/* =========================
   GENERIC API METHODS
========================= */

export const api = {
  get: <T>(
    endpoint: string,
    token?: string
  ) =>
    request<T>(endpoint, {
      method: "GET",
      token,
    }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    token?: string
  ) =>
    request<T>(endpoint, {
      method: "POST",
      body,
      token,
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    token?: string
  ) =>
    request<T>(endpoint, {
      method: "PUT",
      body,
      token,
    }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    token?: string
  ) =>
    request<T>(endpoint, {
      method: "PATCH",
      body,
      token,
    }),

  delete: <T>(
    endpoint: string,
    token?: string
  ) =>
    request<T>(endpoint, {
      method: "DELETE",
      token,
    }),
};