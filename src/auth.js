import { jwtDecode } from "jwt-decode";

let isLoggingOut = false;

/* ─── TOKEN ─── */
export function getToken() {
  return localStorage.getItem("token");
}

/* ─── LOGOUT ─── */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Only redirect if we aren't already on the login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/* ─── AUTH CHECK ─── */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return false; // Just return false, let the caller handle logout
    }
    return true;
  } catch (err) {
    return false;
  }
}

/* ─── API FETCH ─── */
export async function apiFetch(url, options = {}) {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  // 🔴 If token invalid / expired
  if (res.status === 401) {
    logout();
    return null;
  }

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}