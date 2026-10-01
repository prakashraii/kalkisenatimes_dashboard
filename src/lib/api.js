import { baseUrl } from "@/lib/constants";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (!token) {
      const error = new Error("Please log in again.");
      error.status = 401;
      throw error;
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && auth && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }

  if (!response.ok) {
    const message =
      data?.message || data?.error?.message || "Request failed. Try again.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}
