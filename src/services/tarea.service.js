const API_URL = import.meta.env.VITE_API_URL;

export const getAllTask = async () => {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const result = await response.json();
  return result.data;
};
