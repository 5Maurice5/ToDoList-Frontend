const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token inexistente o expirado
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error("Sesión expirada");
  }

  return response;
};
