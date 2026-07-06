const API_BASE = import.meta.env.VITE_API_URL || "https://mira-production-6a48.up.railway.app";

function getToken(): string | null {
  return localStorage.getItem("mira_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("mira_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("mira_admin_token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("adminCollege");
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export { API_BASE };
