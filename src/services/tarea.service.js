const API_URL = import.meta.env.API;

export const getAllTask = async () => {
  const response = await fetch(`${API_URL}/tareas`);

  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  return await response.json();
};
