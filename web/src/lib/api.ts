export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface Contact {
  phone: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:4000";
const TOKEN_KEY = "dice_admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getPlans: () => request<Plan[]>("/api/plans"),
  getContact: () => request<Contact>("/api/contact"),

  login: (username: string, password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request<void>("/api/auth/logout", { method: "POST", headers: authHeaders() }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>("/api/auth/change-password", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  requestPasswordReset: () =>
    request<void>("/api/auth/request-password-reset", { method: "POST" }),

  forgotPassword: (code: string, newPassword: string) =>
    request<void>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ code, newPassword }),
    }),

  updatePlans: (plans: Plan[]) =>
    request<Plan[]>("/api/plans", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(plans),
    }),

  updateContact: (phone: string) =>
    request<Contact>("/api/contact", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ phone }),
    }),
};
