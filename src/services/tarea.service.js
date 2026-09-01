const API_URL = import.meta.env.VITE_API_URL;

export const getAll = async () => {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const result = await response.json();

  return result.data;
};

export const create = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Error al crear la tarea");
  }

  const result = await response.json();

  return result.data;
};
