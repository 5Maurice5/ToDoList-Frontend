const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Credenciales incorrectas");
  }

  return result;
};
