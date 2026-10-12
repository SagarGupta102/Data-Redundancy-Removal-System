const API_BASE_URL = "http://localhost:5000";

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function setAuthSession(token, user) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthSession();
    window.dispatchEvent(new Event("auth-expired"));
  }

  return response;
}
