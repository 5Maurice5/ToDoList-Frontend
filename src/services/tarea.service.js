import { apiFetch } from "./api";

export const getAll = async (page = 1) => {
  const response = await apiFetch(`/tasks?page=${page}`);

  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const result = await response.json();

  return result;
};

export const create = async (task) => {
  const response = await apiFetch("/tasks", {
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
