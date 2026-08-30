const API_URL = import.meta.env.VITE_API_URL;

export const getAll = async () => {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }

  const result = await response.json();

  return result.data;
};
